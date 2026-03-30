import type { ExpenseLimit, ExpenseLimitResponse, ExpenseLimitsResponse, Movement } from "@/types/transaction"
import { formatCurrencyCOP, formatDateLocal } from "@/lib/formatters"

const REGISTER_EXPENSE_LIMIT_ENDPOINT = "http://localhost:8080/registry/limitExpense"
const GET_EXPENSE_LIMIT_ENDPOINT = "http://localhost:8080/get/data/limit-expense"

export interface RegisterExpenseLimitPayload {
  amount: number
  dueDate: string
}

interface RegisterExpenseLimitRequestBody {
  valueLimit: string
  expirationDateRegistry: string
}

export class ExpenseLimitService {
  private static getAuthToken(token?: string): string | undefined {
	if (token) return token
	if (typeof window === "undefined") return undefined

	return sessionStorage.getItem("authToken") || undefined
  }

  private static normalizeToken(token: string): string {
	return token.replace(/^Bearer\s+/i, "").trim()
  }

  private static getTokenHeader(token?: string, mode: "raw" | "bearer" = "raw"): Record<string, string> {
	const authToken = this.getAuthToken(token)
	if (!authToken) return {}

	const normalized = this.normalizeToken(authToken)
	return {
	  Authorization: mode === "bearer" ? `Bearer ${normalized}` : normalized,
	}
  }

  private static async fetchWithAuthFallback(
	url: string,
	init: RequestInit,
	token: string,
	primaryMode: "raw" | "bearer"
  ): Promise<Response> {
	const secondaryMode = primaryMode === "raw" ? "bearer" : "raw"

	const firstResponse = await fetch(url, {
	  ...init,
	  headers: {
		...(init.headers || {}),
		...this.getTokenHeader(token, primaryMode),
	  },
	})

	if (firstResponse.status !== 401) {
	  return firstResponse
	}

	return fetch(url, {
	  ...init,
	  headers: {
		...(init.headers || {}),
		...this.getTokenHeader(token, secondaryMode),
	  },
	})
  }

  private static parseAmount(value: unknown): number {
	if (typeof value === "number") return value
	if (typeof value !== "string") return 0

	const normalized = value.replace(/\D/g, "")
	return normalized ? Number(normalized) : 0
  }

  private static mapFromApi(data: any): ExpenseLimit {
	return {
	  id: data?.id || data?._id,
	  amount: this.parseAmount(data?.amount ?? data?.value ?? data?.valueLimit ?? data?.limitAmount ?? data?.monthlyLimit),
	  dueDate: data?.dueDate || data?.expiration || data?.expirationDateRegistry || data?.expirationDate || data?.expiredAt || "",
	  email: data?.email,
	  createdAt: data?.createdAt || data?.dateRegistry,
	  updatedAt: data?.updatedAt,
	  isActive: data?.isActive ?? data?.active,
	}
  }

  static async getRegisteredLimits(token?: string): Promise<ExpenseLimitsResponse> {
	try {
	  const authToken = this.getAuthToken(token)
	  if (!authToken) {
		return {
		  success: false,
		  message: "No se encontro el token de autenticacion. Inicia sesion nuevamente.",
		}
	  }

	  const response = await this.fetchWithAuthFallback(GET_EXPENSE_LIMIT_ENDPOINT, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		},
	  }, authToken, "raw")

	  const data = await response.json().catch(() => ({}))

	  if (!response.ok) {
		return {
		  success: false,
		  message: data.message || `Error ${response.status}: ${response.statusText}`,
		}
	  }

	  const payload = data?.data ?? data
	  const limitsArray: unknown[] = Array.isArray(payload)
		? payload
		: Array.isArray(payload?.limits)
		  ? payload.limits
		  : payload
			? [payload]
			: []

	  return {
		success: true,
		message: data.message || "Limites mensuales obtenidos correctamente",
		data: limitsArray.map((limit: unknown) => this.mapFromApi(limit)),
	  }
	} catch (error) {
	  return {
		success: false,
		message: error instanceof Error ? error.message : "Error al obtener los limites mensuales",
	  }
	}
  }

  static async getCurrentLimit(token?: string): Promise<ExpenseLimitResponse> {
	try {
	  const limitsResponse = await this.getRegisteredLimits(token)

	  if (!limitsResponse.success) {
		return {
		  success: false,
		  message: limitsResponse.message,
		}
	  }

	  const limits = limitsResponse.data || []
	  if (limits.length === 0) {
		return {
		  success: false,
		  message: "No se encontro un limite mensual activo",
		}
	  }

	  const activeLimit =
		limits.find((limit) => limit.isActive) ||
		[...limits].sort((a, b) => new Date(b.createdAt || b.dueDate).getTime() - new Date(a.createdAt || a.dueDate).getTime())[0]

	  return {
		success: true,
		message: limitsResponse.message || "Limite mensual obtenido correctamente",
		data: activeLimit,
	  }
	} catch (error) {
	  return {
		success: false,
		message: error instanceof Error ? error.message : "Error al obtener el limite mensual",
	  }
	}
  }

  static async createMonthlyLimit(payload: RegisterExpenseLimitPayload, token?: string): Promise<ExpenseLimitResponse> {
	try {
	  if (payload.amount <= 0) {
		throw new Error("El monto del limite debe ser mayor a 0.")
	  }

	  const dueDate = new Date(payload.dueDate)
	  if (Number.isNaN(dueDate.getTime())) {
		throw new Error("La fecha de vencimiento no es valida.")
	  }

	  const authToken = this.getAuthToken(token)
	  if (!authToken) {
		throw new Error("No se encontro el token de autenticacion. Inicia sesion nuevamente.")
	  }

	  const body: RegisterExpenseLimitRequestBody = {
		valueLimit: payload.amount.toFixed(1),
		expirationDateRegistry: dueDate.toISOString().split("T")[0],
	  }

	  const response = await this.fetchWithAuthFallback(REGISTER_EXPENSE_LIMIT_ENDPOINT, {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	  }, authToken, "bearer")

	  const data = await response.json().catch(() => ({}))

	  if (!response.ok) {
		return {
		  success: false,
		  message: data.message || `Error ${response.status}: ${response.statusText}`,
		}
	  }

	  return {
		success: true,
		message: data.message || "Limite mensual registrado correctamente",
		data: this.mapFromApi(data?.data || data),
	  }
	} catch (error) {
	  return {
		success: false,
		message: error instanceof Error ? error.message : "Error al registrar el limite mensual",
	  }
	}
  }

  static calculateCurrentMonthExpense(movements: Movement[]): number {
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	return movements
	  .filter((movement) => {
		const movementDate = new Date(movement.date)
		return movementDate.getMonth() === currentMonth && movementDate.getFullYear() === currentYear
	  })
	  .filter((movement) => movement.typeMovement === "expense")
	  .reduce((total, movement) => total + Number(movement.amount || 0), 0)
  }

  static calculateProgress(currentExpense: number, limitAmount: number): number {
	if (limitAmount <= 0) return 0

	const percentage = (currentExpense / limitAmount) * 100
	return Math.min(Math.max(percentage, 0), 100)
  }

  static formatAmount(amount: number): string {
	return formatCurrencyCOP(amount)
  }

  static formatDueDate(date: string): string {
	return formatDateLocal(date)
  }



}

