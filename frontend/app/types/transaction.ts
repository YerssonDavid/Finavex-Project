export interface Transaction {
  id?: string
  type: "income" | "expense"
  amount: number
  note?: string
  date: string
  userId?: string
}

export interface TransactionResponse {
  success: boolean
  message: string
  data?: Transaction
}

// Tipo para los movimientos del usuario recibidos de la API
export interface Movement {
  id?: string
  typeMovement: "income" | "expense"
  date: string
  note: string
  amount: number
}

export interface MovementsResponse {
  success: boolean
  message: string
  data?: Movement[]
}

// Tipos para planeación
export interface Planning {
  id?: string
  name: string
  category: string
  totalAmount: number
  currentAmount: number
  description?: string
  createdAt: string
  updatedAt?: string
}

export interface PlanningMovement {
  id?: string
  planningId: string
  amount: number
  note?: string
  date: string
}

export interface PlanningResponse {
  success: boolean
  message: string
  data?: Planning
}

export interface PlanningsResponse {
  success: boolean
  message: string
  data?: Planning[]
}

export interface PlanningMovementsResponse {
  success: boolean
  message: string
  data?: PlanningMovement[]
}


export interface SumTotalSavingsResponse {
  success: boolean
  message: string
  data?: number
}

export interface ExpenseLimit {
  id?: string
  amount: number
  dueDate: string
  email?: string
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
}

export interface ExpenseLimitResponse {
  success: boolean
  message: string
  data?: ExpenseLimit
}

export interface ExpenseLimitsResponse {
  success: boolean
  message: string
  data?: ExpenseLimit[]
}
