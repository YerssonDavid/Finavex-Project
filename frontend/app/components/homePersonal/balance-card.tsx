"use client"

import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { balanceEvents } from "@/lib/balanceEvents"

interface MonthlyData {
  amount: number
  isLoading: boolean
}

interface BalanceData {
  balance: number
  percentageChange: number
  isPositive: boolean
  isLoading: boolean
}

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)
  const [incomeData, setIncomeData] = useState<MonthlyData>({ amount: 0, isLoading: true })
  const [expenseData, setExpenseData] = useState<MonthlyData>({ amount: 0, isLoading: true })
  const [currentBalance, setCurrentBalance] = useState<BalanceData>({
    balance: 0,
    percentageChange: 0,
    isPositive: true,
    isLoading: true
  })

  // Función para obtener el token del sessionStorage
  const getAuthToken = (): string => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("authToken") || ""
    }
    return ""
  }

  // Función para obtener ingresos del mes
  const fetchMonthlyIncome = useCallback(async () => {
    setIncomeData(prev => ({ ...prev, isLoading: true }))

    try {
      // Obtener el correo del usuario del localStorage
      let userEmail = ""
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("userData")
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          userEmail = userData.email || ""
        }
      }

      if (!userEmail) {
        throw new Error("No se encontró el correo del usuario")
      }

      // Obtener el token del sessionStorage
      const token = getAuthToken()

      // Petición para obtener ingresos del mes
      const response = await fetch("http://localhost:8080/sum-total-save-month", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📈 Ingresos del mes - Respuesta completa:", JSON.stringify(data, null, 2))

      // Parsear el valor (mismo formato que balance-display)
      let income = 0
      if (data.totalSavedMonth) {
        console.log("📊 Valor original totalSavedMonth:", data.totalSavedMonth)
        const cleanValue = data.totalSavedMonth
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        console.log("📊 Valor limpio:", cleanValue)
        income = parseFloat(cleanValue) || 0
        console.log("📊 Valor parseado:", income)
      } else if (data.totalIncomeMonth) {
        const cleanValue = data.totalIncomeMonth
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        income = parseFloat(cleanValue) || 0
      } else {
        income = data.income ?? data.total ?? data.amount ?? 0
      }

      console.log("✅ Ingresos finales:", income)
      setIncomeData({ amount: income, isLoading: false })
    } catch (err) {
      console.error("❌ Error al obtener ingresos:", err)
      setIncomeData({ amount: 0, isLoading: false })
    }
  }, [])

  // Función para obtener gastos del mes
  const fetchMonthlyExpenses = useCallback(async () => {
    setExpenseData(prev => ({ ...prev, isLoading: true }))

    try {
      // Obtener el correo del usuario del localStorage
      let userEmail = ""
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("userData")
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          userEmail = userData.email || ""
        }
      }

      if (!userEmail) {
        throw new Error("No se encontró el correo del usuario")
      }

      // Obtener el token del sessionStorage
      const token = getAuthToken()

      // Petición para obtener gastos del mes
      const response = await fetch("http://localhost:8080/expenses/month/sum", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📉 Gastos del mes - Respuesta completa:", JSON.stringify(data, null, 2))

      // Parsear el valor (mismo formato que balance-display)
      let expense = 0
      if (data.totalExpensesMonth) {
        console.log("📊 Valor original totalExpensesMonth:", data.totalExpensesMonth)
        const cleanValue = data.totalExpensesMonth
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        console.log("📊 Valor limpio:", cleanValue)
        expense = parseFloat(cleanValue) || 0
        console.log("📊 Valor parseado:", expense)
      } else if (data.totalExpenseMonth) {
        const cleanValue = data.totalExpenseMonth
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        expense = parseFloat(cleanValue) || 0
      } else {
        expense = data.expense ?? data.total ?? data.amount ?? 0
      }

      console.log("✅ Gastos finales:", expense)
      setExpenseData({ amount: expense, isLoading: false })
    } catch (err) {
      console.error("❌ Error al obtener gastos:", err)
      setExpenseData({ amount: 0, isLoading: false })
    }
  }, [])

  // Función para obtener el saldo actual
  const fetchCurrentBalance = useCallback(async () => {
    setCurrentBalance(prev => ({ ...prev, isLoading: true }))

    try {
      // Obtener el correo del usuario del localStorage
      let userEmail = ""
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("userData")
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          userEmail = userData.email || ""
        }
      }

      if (!userEmail) {
        throw new Error("No se encontró el correo del usuario")
      }

      // Obtener el token del sessionStorage
      const token = getAuthToken()

      // Petición para obtener el saldo actual
      const response = await fetch("http://localhost:8080/get/money-now", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("💰 Saldo actual - Respuesta completa:", JSON.stringify(data, null, 2))

      // Parsear el valor del saldo
      let balance = 0
      if (data.currentBalance) {
        const cleanValue = data.currentBalance
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        balance = parseFloat(cleanValue) || 0
      } else if (data.balance) {
        if (typeof data.balance === 'string') {
          const cleanValue = data.balance
            .replace(/\$/g, '')
            .replace(/\s/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
          balance = parseFloat(cleanValue) || 0
        } else {
          balance = data.balance
        }
      } else {
        balance = data.total ?? data.amount ?? data.saldo ?? 0
      }

      const percentageChange = data.percentageChange ?? data.percentage ?? data.change ?? 0

      console.log("✅ Saldo actual:", balance, "Cambio %:", percentageChange)
      setCurrentBalance({
        balance: balance,
        percentageChange: percentageChange,
        isPositive: percentageChange >= 0,
        isLoading: false
      })
    } catch (err) {
      console.error("❌ Error al obtener saldo actual:", err)
      setCurrentBalance({
        balance: 0,
        percentageChange: 0,
        isPositive: true,
        isLoading: false
      })
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchMonthlyIncome()
    fetchMonthlyExpenses()
    fetchCurrentBalance()
  }, [fetchMonthlyIncome, fetchMonthlyExpenses, fetchCurrentBalance])

  // Escuchar eventos de actualización de balance
  useEffect(() => {
    const handleBalanceUpdate = () => {
      console.log("🔄 Actualizando ingresos, gastos y saldo actual...")
      fetchMonthlyIncome()
      fetchMonthlyExpenses()
      fetchCurrentBalance()
    }

    const unsubscribe = balanceEvents.subscribe(handleBalanceUpdate)

    return () => {
      unsubscribe()
    }
  }, [fetchMonthlyIncome, fetchMonthlyExpenses, fetchCurrentBalance])

  // Función para formatear el monto en pesos colombianos
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Card className="bg-card/70 backdrop-blur-[20px] border-white/20 p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground">Saldo Actual</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Saldo actual - consulta API independiente */}
        <div className="space-y-2">
          {currentBalance.isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {showBalance ? formatCurrency(currentBalance.balance) : "••••••"}
              </div>
              <div className={`flex items-center gap-2 ${currentBalance.isPositive ? 'text-success' : 'text-destructive'}`}>
                {currentBalance.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {currentBalance.isPositive ? '+' : ''}{currentBalance.percentageChange}% este mes
                </span>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ingresos del mes</span>
            {incomeData.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-sm font-semibold text-success">
                +{formatCurrency(incomeData.amount)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gastos del mes</span>
            {expenseData.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-sm font-semibold text-destructive">
                -{formatCurrency(expenseData.amount)}
              </span>
            )}
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso mensual</span>
            <span>
              {incomeData.isLoading || expenseData.isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : (
                `${Math.min(100, Math.round((incomeData.amount / (incomeData.amount + expenseData.amount || 1)) * 100))}%`
              )}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 animate-in slide-in-from-left"
              style={{
                width: incomeData.isLoading || expenseData.isLoading
                  ? "0%"
                  : `${Math.min(100, Math.round((incomeData.amount / (incomeData.amount + expenseData.amount || 1)) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
