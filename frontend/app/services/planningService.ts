import type {
  Planning,
  PlanningMovement,
  PlanningsResponse,
  PlanningResponse,
  PlanningMovementsResponse
} from "@/types/transaction"
import Swal from "sweetalert2";

// Categorías predefinidas de planeación
export const PLANNING_CATEGORIES = [
  { id: "viajes", label: "Viajes", icon: "Plane" },
  { id: "compras", label: "Compras", icon: "ShoppingBag" },
  { id: "educacion", label: "Educación", icon: "GraduationCap" },
  { id: "salud", label: "Salud", icon: "Heart" },
  { id: "entretenimiento", label: "Entretenimiento", icon: "Gamepad2" },
  { id: "otros", label: "Otros", icon: "MoreHorizontal" },
]

/**
 * Servicio para manejar la planeación financiera del usuario
 */
export class PlanningService {
  /**
   * Obtiene todas las planeaciones del usuario
   * @returns Lista de planeaciones del usuario
   */
  static async getPlannings(): Promise<PlanningsResponse> {
    try {
      // Obtener el token del sessionStorage
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      console.log("📋 Obteniendo planeaciones del usuario...")

      const response = await fetch(`http://localhost:8080/get/plan-savings`, {
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
      console.log("✅ Planeaciones obtenidas:", data)

      // Adaptar los datos al formato esperado por el frontend
      // Extraer de savingsPlansList del servidor
      const planningsArray = data.savingsPlansList || data.nameSavingsPlan || data.data || data || []
      const plannings = planningsArray.map((item: any) => ({
        id: item.id || item._id,
        name: item.nameSavingsPlan || item.name || item.planningName || "",
        category: item.category || "otros",
        totalAmount: item.amountMetaPlan || item.totalAmount || item.total || 0,
        currentAmount: item.currentAmount || item.current || 0,
        description: item.descriptionPlanSavings || item.description || item.note || "",
        createdAt: item.createdAt || item.date || new Date().toISOString(),
        updatedAt: item.updatedAt,
      }))

      // Almacenar los planes en localStorage para uso futuro
      if (typeof window !== "undefined") {
        const plansForStorage = planningsArray.map((item: any) => ({
          idPlan: item.id || item._id,
          namePlan: item.nameSavingsPlan || item.name || item.planningName || "",
        }))
        localStorage.setItem("savingsPlans", JSON.stringify(plansForStorage))
        console.log("💾 Planes almacenados en localStorage:", plansForStorage)
      }

      return {
        success: true,
        message: "Planeaciones obtenidas exitosamente",
        data: plannings,
      }
    } catch (error) {
      console.error("❌ Error al obtener planeaciones:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener las planeaciones",
        data: [],
      }
    }
  }

  /**
   * Crea una nueva planeación
   * @param planning - Datos de la planeación
   * @returns Respuesta de la creación
   */
  static async createPlanning(planning: Omit<Planning, "id" | "createdAt" | "currentAmount">): Promise<PlanningResponse> {
    try {
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      console.log("📝 Creando nueva planeación:", planning)

      const response = await fetch(`http://localhost:8080/registry/saving-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          nameSavingsPlan: planning.name,
          amountMetaPlan: planning.totalAmount,
          descriptionPlanSavings: planning.description,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Planeación creada:", data)

      // Almacenar el idPlan en localStorage
      if (typeof window !== "undefined" && data.idPlan) {
        localStorage.setItem(`idPlan_${data.namePlan || planning.name}`, String(data.idPlan))

        // También actualizar la lista de planes en localStorage
        const existingPlans = JSON.parse(localStorage.getItem("savingsPlans") || "[]")
        existingPlans.push({
          idPlan: data.idPlan,
          namePlan: data.namePlan || planning.name,
        })
        localStorage.setItem("savingsPlans", JSON.stringify(existingPlans))
        console.log("💾 idPlan almacenado en localStorage:", data.idPlan)
      }

      return {
        success: true,
        message: "Planeación creada exitosamente",
        data: {
          id: data.idPlan || data.id || data._id,
          name: data.namePlan || data.name || planning.name,
          category: data.category || planning.category,
          totalAmount: data.totalAmount || planning.totalAmount,
          currentAmount: data.currentAmount || 0,
          description: data.description || planning.description,
          createdAt: data.createdAt || new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error("❌ Error al crear planeación:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al crear la planeación",
      }
    }
  }

  /**
   * Obtiene los movimientos de una planeación específica
   * @param planningId - ID de la planeación
   * @returns Lista de movimientos de la planeación
   */
  static async getPlanningMovements(planningId: string): Promise<PlanningMovementsResponse> {
    try {
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      console.log("📋 Obteniendo movimientos de planeación:", planningId)

      const response = await fetch(`http://localhost:8080/plannings/${planningId}/movements`, {
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
      console.log("✅ Movimientos de planeación obtenidos:", data)

      const movements = (data.movements || data.data || data || []).map((item: any) => ({
        id: item.id || item._id,
        planningId: item.planningId,
        amount: item.amount || 0,
        note: item.note || item.description || "",
        date: item.date || item.createdAt || new Date().toISOString(),
      }))

      return {
        success: true,
        message: "Movimientos obtenidos exitosamente",
        data: movements,
      }
    } catch (error) {
      console.error("❌ Error al obtener movimientos de planeación:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener los movimientos",
        data: [],
      }
    }
  }

  /**
   * Formatea el monto para mostrar
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
   * Formatea la fecha corta para mostrar
   * @param dateString - Fecha en formato ISO
   * @returns Fecha formateada corta
   */
  static formatShortDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  /**
   * Calcula el porcentaje de progreso
   * @param current - Monto actual
   * @param total - Monto total
   * @returns Porcentaje de progreso
   */
  static calculateProgress(current: number, total: number): number {
    if (total <= 0) return 0
    const progress = (current / total) * 100
    return Math.min(progress, 100)
  }

  /**
   * Obtiene el ícono de la categoría
   * @param category - ID de la categoría
   * @returns Nombre del ícono
   */
  static getCategoryIcon(category: string): string {
    const cat = PLANNING_CATEGORIES.find(c => c.id === category)
    return cat?.icon || "MoreHorizontal"
  }

  /**
   * Obtiene el label de la categoría
   * @param category - ID de la categoría
   * @returns Label de la categoría
   */
  static getCategoryLabel(category: string): string {
    const cat = PLANNING_CATEGORIES.find(c => c.id === category)
    return cat?.label || "Otros"
  }

  /**
   * Obtiene el idPlan desde localStorage a partir del nombre del plan
   * @param planName - Nombre del plan
   * @returns idPlan o null si no se encuentra
   */
  static getPlanIdByName(planName: string): number | null {
    if (typeof window === "undefined") return null

    try {
      const plansJson = localStorage.getItem("savingsPlans")
      if (!plansJson) return null

      const plans: Array<{ idPlan: number; namePlan: string }> = JSON.parse(plansJson)
      const found = plans.find(p => p.namePlan === planName)
      return found?.idPlan ?? null
    } catch {
      console.error("❌ Error al leer planes desde localStorage")
      return null
    }
  }

  /**
   * Registra un movimiento de ahorro en un plan
   * @param namePlan - Nombre del plan
   * @param amount - Monto a ahorrar
   * @returns Respuesta del registro
   */
  static async registerSavingMovement(namePlan: string, amount: number): Promise<PlanningResponse> {
    try {
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      // Obtener el idPlan desde localStorage
      const idPlan = this.getPlanIdByName(namePlan)
      if (idPlan === null) {
        throw new Error(`No se encontró el id del plan "${namePlan}". Recarga la página e intenta de nuevo.`)
      }

      console.log("💰 Registrando movimiento de ahorro:", { idPlan, amount })

      const response = await fetch(`http://localhost:8080/registry/savings-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          idPlan: idPlan,
          amount: amount,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Movimiento de ahorro registrado:", data)

      Swal.fire({
        title: "¡Ahorro registrado!",
        text: "Tu ahorro ha sido registrado exitosamente!",
        icon: "success"
      });

      return {
        success: true,
        message: "Ahorro registrado exitosamente",
        data: data,
      }
    } catch (error) {
      console.error("❌ Error al registrar movimiento de ahorro:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al registrar el ahorro",
      }
    }
  }

  /**
   * Obtiene el saldo total de todos los ahorros del usuario
   * @returns Saldo total de ahorros
   */
  static async getTotalSavings(): Promise<number> {
    try {
      // Obtener el token del sessionStorage
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      console.log("💰 Obteniendo saldo total de ahorros...")

      const response = await fetch(`http://localhost:8080/sumTotal/savings`, {
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
      console.log("✅ Saldo total obtenido:", data)

      // Extraer y retornar el totalSavings de la respuesta
      return data.totalSavings || 0
    } catch (error) {
      console.error("❌ Error al obtener saldo total de ahorros:", error)
      return 0
    }
  }

  /**
   * Obtiene todos los planes de ahorro y los almacena en localStorage.
   * Diseñado para llamarse al iniciar sesión.
   * @returns true si se almacenaron correctamente, false si hubo un error
   */
  static async fetchAndStorePlans(): Promise<boolean> {
    try {
      let authToken: string | undefined
      if (typeof window !== "undefined") {
        authToken = sessionStorage.getItem("authToken") || undefined
      }

      console.log("📋 Obteniendo planes para almacenar en localStorage...")

      const response = await fetch(`http://localhost:8080/list/registry/saving-plan`, {
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
      console.log("✅ Planes obtenidos para localStorage:", data)

      const planningsArray = data.savingsPlansList || data.nameSavingsPlan || data.data || data || []

      if (typeof window !== "undefined") {
        const plansForStorage = planningsArray.map((item: any) => ({
          idPlan: item.id || item._id,
          namePlan: item.nameSavingsPlan || item.name || item.planningName || "",
        }))
        localStorage.setItem("savingsPlans", JSON.stringify(plansForStorage))
        console.log("💾 Planes almacenados en localStorage al iniciar sesión:", plansForStorage)
      }

      return true
    } catch (error) {
      console.error("❌ Error al obtener planes para localStorage:", error)
      return false
    }
  }
}

