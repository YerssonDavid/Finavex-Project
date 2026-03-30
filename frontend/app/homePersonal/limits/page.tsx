"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BadgeDollarSign, CalendarClock, Loader2, RefreshCw } from "lucide-react"
import { ThemeProvider } from "@/components/homePersonal/theme-provider"
import { ExpenseLimitForm } from "@/components/homePersonal/expense-limit-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ExpenseLimit } from "@/types/transaction"
import { ExpenseLimitService } from "@/services/expenseLimitService"
import { MovementService } from "@/services/movementService"

export default function ExpenseLimitsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentLimit, setCurrentLimit] = useState<ExpenseLimit | null>(null)
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0)

  useEffect(() => {
    loadCurrentLimit()
  }, [])

  const loadCurrentLimit = async () => {
    setIsLoading(true)
    setError(null)

    const [limitsResponse, movementsResponse] = await Promise.all([
      ExpenseLimitService.getRegisteredLimits(),
      MovementService.getMovements(),
    ])

    if (limitsResponse.success) {
      const limits = limitsResponse.data || []
      const selectedLimit =
        limits.find((limit) => limit.isActive) ||
        [...limits].sort(
          (a, b) => new Date(b.createdAt || b.dueDate).getTime() - new Date(a.createdAt || a.dueDate).getTime()
        )[0] ||
        null

      setCurrentLimit(selectedLimit)
    } else {
      setCurrentLimit(null)
      setError(limitsResponse.message)
    }

    if (movementsResponse.success) {
      const monthlyExpense = ExpenseLimitService.calculateCurrentMonthExpense(movementsResponse.data || [])
      setCurrentMonthExpense(monthlyExpense)
    } else {
      setCurrentMonthExpense(0)
    }

    setIsLoading(false)
  }

  const handleSetLimit = async (data: { amount: number; dueDate: string }) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const response = await ExpenseLimitService.createMonthlyLimit(data)

    if (!response.success) {
      setError(response.message)
      setIsSubmitting(false)
      return
    }

    setCurrentLimit(response.data || null)
    setShowForm(false)
    setSuccess(response.message)
    setIsSubmitting(false)
  }

  const handleGoBack = () => {
    router.push("/homePersonal")
  }

  const progressPercentage = ExpenseLimitService.calculateProgress(
    currentMonthExpense,
    currentLimit?.amount || 0
  )

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Cargando límite mensual...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleGoBack} className="gap-2 hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
              Volver
            </Button>

            <Button variant="outline" onClick={loadCurrentLimit} className="gap-2" disabled={isLoading || isSubmitting}>
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Límites Mensuales
            </h1>
            <BadgeDollarSign className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mt-2">Define un tope de gasto mensual y controla su vigencia.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <Card className="bg-destructive/10 border-destructive/50">
              <CardContent className="p-4 text-center text-destructive">{error}</CardContent>
            </Card>
          )}

          {success && (
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 text-center text-green-700 dark:text-green-400">{success}</CardContent>
            </Card>
          )}

          <Card className="bg-card/80 backdrop-blur-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                Límite actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLimit ? (
                <div className="space-y-4">
                  <p className="text-2xl font-bold text-primary">{ExpenseLimitService.formatAmount(currentLimit.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    Vigente hasta: {ExpenseLimitService.formatDueDate(currentLimit.dueDate)}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gasto actual del mes</span>
                      <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {ExpenseLimitService.formatAmount(currentMonthExpense)} de {ExpenseLimitService.formatAmount(currentLimit.amount)}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">Aun no tienes un límite mensual registrado.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowForm((prev) => !prev)
                setError(null)
                setSuccess(null)
              }}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {showForm ? "Ocultar formulario" : "Establecer límite"}
            </Button>
          </div>

          {showForm && (
            <ExpenseLimitForm
              isSubmitting={isSubmitting}
              onCancel={() => setShowForm(false)}
              onSubmit={handleSetLimit}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

