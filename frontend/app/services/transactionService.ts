import type { Transaction, TransactionResponse } from "@/types/transaction"

// Configuración de la API - Endpoints separados para ingresos y gastos
const API_ENDPOINTS = {
  // Endpoint para registrar ingresos
  income: "http://localhost:8080/save-money",
  // Endpoint para registrar gastos
  expense: "http://localhost:8080/expenses/registry",
}

/**
 * Servicio para manejar transacciones financieras
 */
export class TransactionService {
  /**
   * Registra una nueva transacción (ingreso o gasto)
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

      // Formatear la fecha en YYYY-MM-DD
      const transactionDate = new Date(transaction.date)
      const formattedDate = transactionDate.toISOString().split('T')[0]

      // Construir los datos según el tipo de transacción
      let transactionData: any
      let endpoint: string
      let transactionLabel: string

      if (transaction.type === "income") {
        // Formato para INGRESOS
        transactionData = {
          date: formattedDate,
          savedAmount: transaction.amount,
          email: userEmail,
        }

        // Agregar nota solo si está presente
        if (transaction.note) {
          transactionData.note = transaction.note
        }

        endpoint = API_ENDPOINTS.income
        transactionLabel = "Ingreso"
        console.log("💰 Registrando INGRESO")
      } else {
        // Formato para GASTOS
        transactionData = {
          date: formattedDate,
          expenseAmount: transaction.amount,
          email: userEmail,
        }

        // Agregar nota solo si está presente
        if (transaction.note) {
          transactionData.description = transaction.note
        }

        endpoint = API_ENDPOINTS.expense
        transactionLabel = "Gasto"
        console.log("💸 Registrando GASTO")
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Si tienes un token de autenticación, agrégalo
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      console.log(`📋 Endpoint: ${endpoint}`)
      console.log("📋 Datos enviados:", JSON.stringify(transactionData, null, 2))

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
        console.log(`✅ ${transactionLabel} registrado exitosamente:`, responseData)

        return {
          success: true,
          message: `✅ ${transactionLabel} registrado correctamente`,
          data: responseData.data || transactionData,
        }
      } else {
        console.error(`❌ Error en la respuesta del servidor:`, responseData)
        const errorMessage =
          responseData.message || `Error ${response.status}: ${response.statusText}`

        return {
          success: false,
          message: `❌ No fue posible registrar el ${transactionLabel.toLowerCase()}. ${errorMessage}`,
          data: undefined,
        }
      }
    } catch (error) {
      console.error("❌ Error al registrar transacción:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      const transactionLabel = transaction.type === "income" ? "ingreso" : "gasto"
      return {
        success: false,
        message: `❌ No fue posible registrar el ${transactionLabel}. ${errorMessage}`,
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
