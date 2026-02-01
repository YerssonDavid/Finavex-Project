"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  FileText,
  X,
  Loader2,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react"
import { MovementService } from "@/services/movementService"
import type { Movement } from "@/types/transaction"
import { ThemeProvider } from "@/components/homePersonal/theme-provider"

export default function MovementsUserPage() {
  const router = useRouter()
  const [movements, setMovements] = useState<Movement[]>([])
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar movimientos al montar
  useEffect(() => {
    loadMovements()
  }, [])

  const loadMovements = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await MovementService.getMovements()

      if (response.success && response.data) {
        setMovements(response.data)
      } else {
        setError(response.message || "Error al cargar los movimientos")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intenta más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular totales
  const totalIncome = movements
    .filter(m => m.typeMovement === "income")
    .reduce((sum, m) => sum + m.amount, 0)

  const totalExpense = movements
    .filter(m => m.typeMovement === "expense")
    .reduce((sum, m) => sum + m.amount, 0)

  const handleGoBack = () => {
    router.push("/homePersonal")
  }

  const openMovementDetail = (movement: Movement) => {
    setSelectedMovement(movement)
  }

  const closeMovementDetail = () => {
    setSelectedMovement(null)
  }

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Cargando movimientos...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 md:p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </Button>

            <Button
              variant="outline"
              onClick={loadMovements}
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mt-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Mis Movimientos
          </h1>
          <p className="text-muted-foreground mt-2">
            Historial completo de tus transacciones financieras
          </p>
        </div>

        {/* Summary Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/80 backdrop-blur-lg border-green-500/30 hover:border-green-500/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Ingresos</p>
                <p className="text-xl font-bold text-green-500">
                  {MovementService.formatAmount(totalIncome)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-lg border-red-500/30 hover:border-red-500/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gastos</p>
                <p className="text-xl font-bold text-red-500">
                  {MovementService.formatAmount(totalExpense)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-lg border-primary/30 hover:border-primary/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {MovementService.formatAmount(totalIncome - totalExpense)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="bg-destructive/10 border-destructive/50">
              <CardContent className="p-4 text-center text-destructive">
                {error}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Movements List */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Lista de Movimientos
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({movements.length} {movements.length === 1 ? 'movimiento' : 'movimientos'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No hay movimientos registrados</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Tus transacciones aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {movements.map((movement, index) => (
                    <div
                      key={movement.id || index}
                      onClick={() => openMovementDetail(movement)}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    >
                      {/* Icon */}
                      <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${
                        movement.typeMovement === "income" 
                          ? "bg-green-500/20" 
                          : "bg-red-500/20"
                      }`}>
                        {movement.typeMovement === "income" ? (
                          <ArrowUpCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {movement.note || (movement.typeMovement === "income" ? "Ingreso" : "Gasto")}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {MovementService.formatDate(movement.date)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className={`text-right font-bold ${
                        movement.typeMovement === "income" 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}>
                        {movement.typeMovement === "income" ? "+" : "-"}
                        {MovementService.formatAmount(movement.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Movement Detail Modal */}
        {selectedMovement && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeMovementDetail}
          >
            <Card
              className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMovementDetail}
                  className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${
                    selectedMovement.typeMovement === "income" 
                      ? "bg-green-500/20" 
                      : "bg-red-500/20"
                  }`}>
                    {selectedMovement.typeMovement === "income" ? (
                      <ArrowUpCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedMovement.typeMovement === "income" ? "Ingreso" : "Gasto"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Detalle del movimiento
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                {/* Amount */}
                <div className="text-center py-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Monto</p>
                  <p className={`text-3xl font-bold ${
                    selectedMovement.typeMovement === "income" 
                      ? "text-green-500" 
                      : "text-red-500"
                  }`}>
                    {selectedMovement.typeMovement === "income" ? "+" : "-"}
                    {MovementService.formatAmount(selectedMovement.amount)}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="font-medium">{MovementService.formatDate(selectedMovement.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Descripción</p>
                      <p className="font-medium">
                        {selectedMovement.note || "Sin descripción"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Movimiento</p>
                      <p className={`font-medium ${
                        selectedMovement.typeMovement === "income" 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}>
                        {selectedMovement.typeMovement === "income" ? "Ingreso" : "Gasto"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  onClick={closeMovementDetail}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Cerrar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}
