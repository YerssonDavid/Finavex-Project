import type { ExpenseLimit, ExpenseLimitResponse, Movement } from "@/types/transaction"
import { formatCurrencyCOP, formatDateLocal } from "@/lib/formatters"

const REGISTER_EXPENSE_LIMIT_ENDPOINT = "http://localhost:8080/registry/limitExpense"
const GET_EXPENSE_LIMIT_ENDPOINT = "http://localhost:8080/expenses/limits/monthly"

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

  private static getUserEmail(): string {
	if (typeof window === "undefined") return ""

	const userData = localStorage.getItem("userData")
	if (!userData) return ""

	try {
	  const parsed = JSON.parse(userData)
	  return parsed?.email || ""
	} catch {
	  return ""
	}
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
	  amount: this.parseAmount(data?.amount ?? data?.valueLimit ?? data?.limitAmount ?? data?.monthlyLimit),
	  dueDate: data?.dueDate || data?.expirationDateRegistry || data?.expirationDate || data?.expiredAt || "",
	  email: data?.email,
	  createdAt: data?.createdAt,
	  updatedAt: data?.updatedAt,
	  isActive: data?.isActive ?? data?.active,
	}
  }

  static async getCurrentLimit(token?: string): Promise<ExpenseLimitResponse> {
	try {
	  const authToken = this.getAuthToken(token)
	  const email = this.getUserEmail()

	  const query = email ? `?email=${encodeURIComponent(email)}` : ""

	  const response = await fetch(`${GET_EXPENSE_LIMIT_ENDPOINT}${query}`, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
		},
	  })

	  const data = await response.json().catch(() => ({}))

	  if (!response.ok) {
		return {
		  success: false,
		  message: data.message || `Error ${response.status}: ${response.statusText}`,
		}
	  }

	  const payload = data?.data || data
	  if (!payload) {
		return {
		  success: false,
		  message: "No se encontro un limite mensual activo",
		}
	  }

	  return {
		success: true,
		message: data.message || "Limite mensual obtenido correctamente",
		data: this.mapFromApi(payload),
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

	  const response = await fetch(REGISTER_EXPENSE_LIMIT_ENDPOINT, {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${authToken}`,
		},
		body: JSON.stringify(body),
	  })

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

