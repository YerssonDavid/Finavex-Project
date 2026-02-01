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
