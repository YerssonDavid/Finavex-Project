import type { MovementsResponse } from "@/types/transaction"

/**
 * Servicio para manejar los movimientos del usuario
 */
export class MovementService {
  /**
   * Obtiene todos los movimientos del usuario
   * @param token - Token de autenticación (opcional)
   * @returns Lista de movimientos del usuario
   */
  static async getMovements(token?: string): Promise<MovementsResponse> {
    try {
      // Obtener el correo del usuario del localStorage
      let userEmail = ""
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("userData")
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr)
            userEmail = userData.email || ""
          } catch {
            // userData no se pudo parsear
          }
        }
      }

      if (!userEmail) {
        throw new Error("No se encontró el correo del usuario. Por favor, inicia sesión nuevamente.")
      }

      // Obtener el token del sessionStorage si no se proporciona como parámetro
      let authToken = token
      if (!authToken && typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      const response = await fetch(`http://localhost:8080/movements`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Adaptar los datos al formato esperado por el frontend
      const movements = (data.movements || data.data || data || []).map((item: any) => ({
        typeMovement: item.movementType || item.typeMovement || item.type || "",
        date: item.date,
        note: item.noteMovement ?? item.note ?? null,
        amount: item.amountMovement ?? item.amount ?? 0,
      }))

      return {
        success: true,
        message: "Movimientos obtenidos exitosamente",
        data: movements,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener los movimientos",
        data: [],
      }
    }
  }

  /**
   * Formatea la fecha para mostrar
   * @param dateString - Fecha en formato ISO
   * @returns Fecha formateada
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  /**
   * Formatea la fecha y hora para mostrar en detalles (formato 12H)
   * @param dateString - Fecha en formato ISO
   * @returns Fecha y hora formateadas
   */
  static formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  /**
   * Formatea el monto como moneda
   * @param amount - Monto a formatear
   * @returns Monto formateado
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
}
