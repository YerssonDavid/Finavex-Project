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
          } catch {
            // userData no se pudo parsear
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
      }

      // Obtener el token de autenticación
      const authToken = token || (typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null)

      const response = await fetch(endpoint, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
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

        return {
          success: true,
          message: `✅ ${transactionLabel} registrado correctamente`,
          data: responseData.data || transactionData,
        }
      } else {
        const errorMessage =
          responseData.message || `Error ${response.status}: ${response.statusText}`

        return {
          success: false,
          message: `❌ No fue posible registrar el ${transactionLabel.toLowerCase()}. ${errorMessage}`,
          data: undefined,
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      const transactionLabel = transaction.type === "income" ? "ingreso" : "gasto"
      return {
        success: false,
        message: `❌ No fue posible registrar el ${transactionLabel}. ${errorMessage}`,
        data: undefined,
      }
    }
  }
}
