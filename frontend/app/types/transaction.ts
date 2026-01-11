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

