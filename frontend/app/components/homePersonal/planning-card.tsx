"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Loader2,
  ChevronRight,
  Plane,
  ShoppingBag,
  GraduationCap,
  Heart,
  Gamepad2,
  MoreHorizontal,
  AlertCircle
} from "lucide-react"
import { PlanningService } from "@/services/planningService"
import type { Planning } from "@/types/transaction"

// Mapa de iconos para las categorías
const categoryIcons: Record<string, React.ElementType> = {
  Plane,
  ShoppingBag,
  GraduationCap,
  Heart,
  Gamepad2,
  MoreHorizontal,
}

// Colores por categoría
const categoryColors: Record<string, string> = {
  viajes: "from-blue-500 to-blue-600",
  compras: "from-pink-500 to-pink-600",
  educacion: "from-green-500 to-green-600",
  salud: "from-red-500 to-red-600",
  entretenimiento: "from-purple-500 to-purple-600",
  otros: "from-gray-500 to-gray-600",
}

export function PlanningCard() {
  const router = useRouter()
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlannings()
  }, [])

  const loadPlannings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await PlanningService.getPlannings()

      if (response.success && response.data) {
        // Tomar solo los últimos 3 registros
        const latestPlannings = response.data.slice(0, 3)
        setPlannings(latestPlannings)
      } else {
        setError(response.message || "Error al cargar")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconName = PlanningService.getCategoryIcon(category)
    return categoryIcons[iconName] || MoreHorizontal
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.otros
  }

  // Calcular total ahorrado
  const totalSaved = plannings.reduce((sum, p) => sum + p.currentAmount, 0)

  const handleViewAll = () => {
    router.push("/homePersonal/planning")
  }

  return (
    <Card className="glass border-white/20 p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Planeación</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="text-xs text-muted-foreground hover:text-primary gap-1"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPlannings}
              className="mt-2 text-xs"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && plannings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Sin planeaciones</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAll}
              className="mt-2 text-xs text-primary"
            >
              Crear primera planeación
            </Button>
          </div>
        )}

        {/* Plannings List */}
        {!isLoading && !error && plannings.length > 0 && (
          <div className="space-y-5">
            {plannings.map((planning, index) => {
              const Icon = getCategoryIcon(planning.category)
              const color = getCategoryColor(planning.category)
              const percentage = PlanningService.calculateProgress(
                planning.currentAmount,
                planning.totalAmount
              )

              return (
                <div
                  key={planning.id || index}
                  onClick={handleViewAll}
                  className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:from-white/10 hover:to-white/20 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-balance truncate max-w-[150px]">
                          {planning.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {PlanningService.formatAmount(planning.currentAmount)} de {PlanningService.formatAmount(planning.totalAmount)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{percentage.toFixed(0)}%</span>
                  </div>

                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        )}

        {/* Total Footer */}
        {!isLoading && !error && plannings.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total ahorrado</span>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {PlanningService.formatAmount(totalSaved)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
