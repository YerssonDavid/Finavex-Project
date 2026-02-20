"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Plus,
  Clock,
  DollarSign,
  X,
  Loader2,
  RefreshCw,
  Plane,
  ShoppingBag,
  GraduationCap,
  Heart,
  Gamepad2,
  MoreHorizontal,
  Calendar,
  ChevronRight,
  ListFilter,
  PiggyBank
} from "lucide-react"
import { PlanningService, PLANNING_CATEGORIES } from "@/services/planningService"
import type { Planning, PlanningMovement } from "@/types/transaction"
import { ThemeProvider } from "@/components/homePersonal/theme-provider"
import { SavingMovementModal } from "@/components/homePersonal/saving-movement-modal"

// Mapa de iconos para las categorías
const categoryIcons: Record<string, React.ElementType> = {
  Plane,
  ShoppingBag,
  GraduationCap,
  Heart,
  Gamepad2,
  MoreHorizontal,
}

export default function PlanningPage() {
  const router = useRouter()
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null)
  const [planningMovements, setPlanningMovements] = useState<PlanningMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMovements, setIsLoadingMovements] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Estados para el modal de ahorro
  const [showSavingModal, setShowSavingModal] = useState(false)
  const [selectedPlanForSaving, setSelectedPlanForSaving] = useState<Planning | null>(null)

  // Form state para crear planeación
  const [newPlanning, setNewPlanning] = useState({
    name: "",
    category: "otros",
    totalAmount: "",
    description: "",
  })

  // Cargar planeaciones al montar
  useEffect(() => {
    // Asegurar que los planes estén en localStorage para poder registrar ahorros
    PlanningService.fetchAndStorePlans().then(() => {
      console.log("✅ Planes cargados en localStorage desde la página de planning")
    })
    loadPlannings()
  }, [])

  const loadPlannings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await PlanningService.getPlannings()

      if (response.success && response.data) {
        setPlannings(response.data)
      } else {
        setError(response.message || "Error al cargar las planeaciones")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intenta más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadPlanningMovements = async (planning: Planning) => {
    if (!planning.id) return

    setIsLoadingMovements(true)
    setSelectedPlanning(planning)

    try {
      const response = await PlanningService.getPlanningMovements(planning.id)

      if (response.success && response.data) {
        setPlanningMovements(response.data)
      } else {
        setPlanningMovements([])
      }
    } catch (err) {
      setPlanningMovements([])
    } finally {
      setIsLoadingMovements(false)
    }
  }

  const handleCreatePlanning = async () => {
    // Validaciones
    if (!newPlanning.name) {
      setError("El nombre del plan es requerido")
      return
    }

    if (!newPlanning.totalAmount) {
      setError("El monto objetivo es requerido")
      return
    }

    const amount = parseFloat(newPlanning.totalAmount)
    if (amount <= 1000) {
      setError("El monto objetivo debe ser mayor a $1.000")
      return
    }

    if (!newPlanning.description || newPlanning.description.trim() === "") {
      setError("La descripción es requerida")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const response = await PlanningService.createPlanning({
        name: newPlanning.name,
        category: newPlanning.category,
        totalAmount: amount,
        description: newPlanning.description.trim(),
      })

      if (response.success) {
        setShowCreateModal(false)
        setNewPlanning({ name: "", category: "otros", totalAmount: "", description: "" })
        loadPlannings()
      } else {
        setError(response.message || "Error al crear la planeación")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intenta más tarde.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleGoBack = () => {
    router.push("/homePersonal")
  }

  const closePlanningDetail = () => {
    setSelectedPlanning(null)
    setPlanningMovements([])
  }

  const openSavingModal = (planning: Planning, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se abra el detalle del plan
    setSelectedPlanForSaving(planning)
    setShowSavingModal(true)
  }

  const handleSavingSubmit = async (amount: number) => {
    if (!selectedPlanForSaving) {
      throw new Error("No hay plan seleccionado")
    }

    const response = await PlanningService.registerSavingMovement(
      selectedPlanForSaving.name,
      amount
    )

    if (!response.success) {
      throw new Error(response.message || "Error al registrar el ahorro")
    }

    // Recargar las planeaciones para actualizar el progreso
    loadPlannings()
  }

  const formatAmountInput = (value: string): string => {
    if (!value) return ""
    // Remover caracteres no numéricos
    const numericValue = value.replace(/[^\d]/g, "")
    // Convertir a número y formatear con puntuación
    if (numericValue === "") return ""
    const num = parseInt(numericValue, 10)
    return new Intl.NumberFormat("es-CO").format(num)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Almacenar solo números en el estado
    const numericValue = value.replace(/[^\d]/g, "")
    setNewPlanning({ ...newPlanning, totalAmount: numericValue })
  }

  const getCategoryIcon = (category: string) => {
    const iconName = PlanningService.getCategoryIcon(category)
    return categoryIcons[iconName] || MoreHorizontal
  }

  // Agrupar planeaciones por categoría
  const planningsByCategory = plannings.reduce((acc, planning) => {
    const category = planning.category || "otros"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(planning)
    return acc
  }, {} as Record<string, Planning[]>)

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Cargando planeaciones...</p>
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
              onClick={loadPlannings}
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Planeación
                </h1>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mt-2">
                Organiza y planifica tus finanzas por categorías
              </p>
            </div>
          </div>
        </div>

        {/* Botón Registrar Planeación */}
        <div className="max-w-4xl mx-auto mb-6">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Registrar planeación
          </Button>
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

        {/* Lista de Planeaciones por Categoría */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-primary" />
                Lista completa de planes
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({plannings.length} {plannings.length === 1 ? 'plan' : 'planes'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plannings.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No hay planeaciones registradas</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Crea tu primera planeación para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {PLANNING_CATEGORIES.map((category) => {
                    const categoryPlannings = planningsByCategory[category.id] || []
                    if (categoryPlannings.length === 0) return null

                    const CategoryIcon = getCategoryIcon(category.id)

                    return (
                      <div key={category.id} className="space-y-2">
                        {/* Category Header */}
                        <div className="flex items-center gap-2 px-2">
                          <CategoryIcon className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-foreground">{category.label}</span>
                          <span className="text-sm text-muted-foreground">
                            ({categoryPlannings.length})
                          </span>
                        </div>

                        {/* Plannings in this category */}
                        <div className="space-y-2 pl-2">
                          {categoryPlannings.map((planning) => {
                            const progress = PlanningService.calculateProgress(
                              planning.currentAmount,
                              planning.totalAmount
                            )

                            return (
                              <div
                                key={planning.id}
                                onClick={() => loadPlanningMovements(planning)}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                              >
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{planning.name}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex-1">
                                      <Progress value={progress} className="h-2" />
                                    </div>
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                      {progress.toFixed(0)}%
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {PlanningService.formatAmount(planning.currentAmount)} / {PlanningService.formatAmount(planning.totalAmount)}
                                  </p>
                                </div>

                                {/* Botón Agregar Ahorro */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => openSavingModal(planning, e)}
                                  className="gap-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                  title="Agregar ahorro"
                                >
                                  <PiggyBank className="h-4 w-4" />
                                  <span className="hidden sm:inline">Ahorrar</span>
                                </Button>

                                {/* Arrow */}
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal Crear Planeación */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <Card
              className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                  className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/20">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Nueva Planeación</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Crea un nuevo plan financiero
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del plan</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Viaje a Europa"
                    value={newPlanning.name}
                    onChange={(e) => setNewPlanning({ ...newPlanning, name: e.target.value })}
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANNING_CATEGORIES.map((category) => {
                      const CategoryIcon = getCategoryIcon(category.id)
                      const isSelected = newPlanning.category === category.id

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setNewPlanning({ ...newPlanning, category: category.id })}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                          <span className="text-xs">{category.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Monto Total */}
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Monto objetivo</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalAmount"
                      type="text"
                      placeholder="0"
                      className="pl-10"
                      value={formatAmountInput(newPlanning.totalAmount)}
                      onChange={handleAmountChange}
                    />
                  </div>
                  {newPlanning.totalAmount && parseFloat(newPlanning.totalAmount) <= 1000 && (
                    <p className="text-xs text-destructive mt-1">
                      El monto debe ser mayor a $1.000
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Describe tu plan..."
                    value={newPlanning.description}
                    onChange={(e) => setNewPlanning({ ...newPlanning, description: e.target.value })}
                  />
                  {newPlanning.description.trim() === "" && (
                    <p className="text-xs text-destructive">
                      La descripción es requerida
                    </p>
                  )}
                </div>

                {/* Botón Crear */}
                <Button
                  onClick={handleCreatePlanning}
                  disabled={
                    !newPlanning.name ||
                    !newPlanning.totalAmount ||
                    parseFloat(newPlanning.totalAmount || "0") <= 1000 ||
                    !newPlanning.description ||
                    newPlanning.description.trim() === "" ||
                    isCreating
                  }
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Planeación
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal Detalle de Planeación con Movimientos */}
        {selectedPlanning && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closePlanningDetail}
          >
            <Card
              className="w-full max-w-lg bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative pb-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePlanningDetail}
                  className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-4">
                  {(() => {
                    const CategoryIcon = getCategoryIcon(selectedPlanning.category)
                    return (
                      <div className="p-4 rounded-full bg-primary/20">
                        <CategoryIcon className="h-8 w-8 text-primary" />
                      </div>
                    )
                  })()}
                  <div>
                    <CardTitle className="text-xl text-primary">
                      {selectedPlanning.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {PlanningService.getCategoryLabel(selectedPlanning.category)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 overflow-y-auto flex-1">
                {/* Progress */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progreso</span>
                    <span className="text-sm font-medium text-primary">
                      {PlanningService.calculateProgress(selectedPlanning.currentAmount, selectedPlanning.totalAmount).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={PlanningService.calculateProgress(selectedPlanning.currentAmount, selectedPlanning.totalAmount)}
                    className="h-3"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-primary">
                      {PlanningService.formatAmount(selectedPlanning.currentAmount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      de {PlanningService.formatAmount(selectedPlanning.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                {selectedPlanning.description && (
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">{selectedPlanning.description}</p>
                  </div>
                )}

                {/* Lista de Movimientos */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Movimientos del plan
                  </h3>

                  {isLoadingMovements ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : planningMovements.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No hay movimientos registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {planningMovements.map((movement, index) => (
                        <div
                          key={movement.id || index}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                        >
                          <div>
                            <p className="font-medium text-primary">
                              {PlanningService.formatAmount(movement.amount)}
                            </p>
                            {movement.note && (
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {movement.note}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {PlanningService.formatShortDate(movement.date)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón Cerrar */}
                <Button
                  onClick={closePlanningDetail}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                >
                  Cerrar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal para registrar movimiento de ahorro */}
        <SavingMovementModal
          isOpen={showSavingModal}
          onClose={() => {
            setShowSavingModal(false)
            setSelectedPlanForSaving(null)
          }}
          planName={selectedPlanForSaving?.name || ""}
          onSubmit={handleSavingSubmit}
        />
      </div>
    </ThemeProvider>
  )
}

