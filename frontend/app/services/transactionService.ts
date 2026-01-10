import type { Transaction, TransactionResponse } from "@/types/transaction"

// Configuración de la API - MODIFICA ESTO CON TU URL REAL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

/**
 * Servicio para manejar transacciones financieras
 */
export class TransactionService {
  /**
   * Registra una nueva transacción (ingreso o gasto)
   * @param transaction - Datos de la transacción
   * @param token - Token de autenticación (opcional)
   * @returns Respuesta del servidor con la transacción creada
   */
  static async createTransaction(
    transaction: Omit<Transaction, "id">,
    token?: string
  ): Promise<TransactionResponse> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Si tienes un token de autenticación, agrégalo
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers,
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data: TransactionResponse = await response.json()
      return data
    } catch (error) {
      console.error("❌ Error al crear transacción:", error)
      throw error
    }
  }

  /**
   * Obtiene todas las transacciones del usuario
   * @param token - Token de autenticación
   * @returns Lista de transacciones
   */
  static async getTransactions(token?: string): Promise<Transaction[]> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("❌ Error al obtener transacciones:", error)
      throw error
    }
  }

  /**
   * Elimina una transacción
   * @param id - ID de la transacción
   * @param token - Token de autenticación
   */
  static async deleteTransaction(id: string, token?: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("❌ Error al eliminar transacción:", error)
      throw error
    }
  }
}

