import type { Transaction, TransactionResponse } from "@/types/transaction"

// Configuración de la API - Solo endpoint de ingresos por ahora
const API_ENDPOINTS = {
  // Endpoint para registrar ingresos
  income: "http://localhost:8080/save-money",
}

/**
 * Servicio para manejar transacciones financieras
 */
export class TransactionService {
  /**
   * Registra una nueva transacción de ingreso
   * Incluye el correo del usuario desde localStorage
   * @param transaction - Datos de la transacción
   * @param token - Token de autenticación (opcional)
   * @returns Respuesta del servidor con la transacción creada
   */
  static async createTransaction(
    transaction: Omit<Transaction, "id">,
    token?: string
  ): Promise<TransactionResponse> {
    try {
      // Obtener el correo del usuario del localStorage
      let userEmail = ""
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("userData")
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr)
            userEmail = userData.email || ""
          } catch (parseError) {
            console.warn("⚠️ No se pudo parsear userData del localStorage:", parseError)
          }
        }
      }

      if (!userEmail) {
        throw new Error("No se encontró el correo del usuario. Por favor, inicia sesión nuevamente.")
      }

      // Construir los datos a enviar incluyendo el email
      const transactionData = {
        ...transaction,
        email: userEmail,
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Si tienes un token de autenticación, agrégalo
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Usar solo el endpoint de ingresos
      const endpoint = API_ENDPOINTS.income

      console.log(`📤 Enviando INGRESO a: ${endpoint}`)
      console.log("📋 Datos enviados:", transactionData)

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(transactionData),
      })

      // Obtener la respuesta del servidor
      let responseData: any
      try {
        responseData = await response.json()
      } catch {
        responseData = {}
      }

      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        console.log("✅ Ingreso registrado exitosamente:", responseData)
        return {
          success: true,
          message: "✅ Ingreso registrado correctamente",
          data: responseData.data || transactionData,
        }
      } else {
        console.error("❌ Error en la respuesta del servidor:", responseData)
        const errorMessage =
          responseData.message || `Error ${response.status}: ${response.statusText}`
        return {
          success: false,
          message: `❌ No fue posible registrar el ingreso. ${errorMessage}`,
          data: undefined,
        }
      }
    } catch (error) {
      console.error("❌ Error al registrar ingreso:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      return {
        success: false,
        message: `❌ No fue posible registrar el ingreso. ${errorMessage}`,
        data: undefined,
      }
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

      // Actualiza esta URL con tu endpoint real para obtener transacciones
      const response = await fetch("http://localhost:8080/transactions", {
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

      // Actualiza esta URL con tu endpoint real para eliminar transacciones
      const response = await fetch(`http://localhost:8080/transactions/${id}`, {
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

