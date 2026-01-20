"use client"

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { balanceEvents } from "@/lib/balanceEvents"

interface BalanceData {
  balance: number
  percentageChange: number
  isPositive: boolean
}

interface BalanceDisplayProps {
  showBalance: boolean
}

export function BalanceDisplay({ showBalance }: BalanceDisplayProps) {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    setIsLoading(true)
    setError(null)

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
        throw new Error("No se encontró el correo del usuario")
      }

      // Enviar petición POST con el correo del usuario
      const response = await fetch("http://localhost:8080/sum-total-save-month?", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Log para debug - ver estructura de la respuesta
      console.log("📊 Respuesta de la API:", JSON.stringify(data, null, 2))

      // Parsear el valor de totalSavedMonth que viene como string formateado
      // Ejemplo: "$ 327.000.000,00" -> 327000000.00
      let balance = 0
      if (data.totalSavedMonth) {
        // Remover el símbolo $, espacios, y convertir formato colombiano a número
        const cleanValue = data.totalSavedMonth
          .replace(/\$/g, '')      // Quitar símbolo $
          .replace(/\s/g, '')      // Quitar espacios
          .replace(/\./g, '')      // Quitar puntos (separadores de miles)
          .replace(',', '.')       // Cambiar coma decimal por punto
        balance = parseFloat(cleanValue) || 0
      } else {
        // Intentar otros campos posibles
        balance = data.balance ?? data.total ?? data.amount ?? data.savedAmount ?? data.totalSaved ?? data.sum ?? 0
      }

      const percentageChange = data.percentageChange ?? data.percentage ?? data.change ?? 0

      console.log("💰 Balance parseado:", balance)

      setBalanceData({
        balance: balance,
        percentageChange: percentageChange,
        isPositive: percentageChange >= 0,
      })
    } catch (err) {
      console.error("❌ Error al obtener el saldo:", err)
      setError(err instanceof Error ? err.message : "Error al obtener el saldo")
      // Establecer datos por defecto en caso de error
      setBalanceData({
        balance: 0,
        percentageChange: 0,
        isPositive: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Ejecutar la consulta al montar el componente y cuando se recargue la página
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  // Suscribirse al evento de actualización cuando se registra una transacción
  useEffect(() => {
    const unsubscribe = balanceEvents.subscribe(() => {
      console.log("🔄 Actualizando saldo después de registrar transacción...")
      fetchBalance()
    })

    // Limpiar suscripción al desmontar
    return () => unsubscribe()
  }, [fetchBalance])

  // Formatear el saldo como moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">Cargando saldo...</span>
        </div>
      </div>
    )
  }

  // Estado de error (muestra datos por defecto)
  if (error && !balanceData) {
    return (
      <div className="space-y-2">
        <div className="text-4xl font-bold text-destructive">
          Error
        </div>
        <div className="flex items-center gap-2 text-destructive">
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-4xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
        {showBalance ? formatCurrency(balanceData?.balance || 0) : "••••••"}
      </div>
      <div className={`flex items-center gap-2 ${balanceData?.isPositive ? "text-success" : "text-destructive"}`}>
        {balanceData?.isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {balanceData?.isPositive ? "+" : ""}
          {balanceData?.percentageChange?.toFixed(1) || 0}% este mes
        </span>
      </div>
    </div>
  )
}

