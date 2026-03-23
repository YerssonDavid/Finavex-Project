"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { formatCopInput, parseCopInput } from "@/lib/formatters"

interface ExpenseLimitFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (data: { amount: number; dueDate: string }) => Promise<void>
}

export function ExpenseLimitForm({ isSubmitting, onCancel, onSubmit }: ExpenseLimitFormProps) {
  const [amountInput, setAmountInput] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState<string | null>(null)

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    const amount = parseCopInput(amountInput)

    if (amount <= 100) {
      setError("El monto del límite debe ser mayor a 100")
      return
    }

    if (!dueDate) {
      setError("Debes seleccionar una fecha de vencimiento")
      return
    }

    if (dueDate < today) {
      setError("La fecha de vencimiento no puede ser menor a hoy")
      return
    }

    await onSubmit({ amount, dueDate })
    setAmountInput("")
    setDueDate("")
  }

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Establecer límite mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="limit-amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monto del límite
            </Label>
            <Input
              id="limit-amount"
              type="text"
              inputMode="numeric"
              placeholder="Ej: 2.000.000"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(formatCopInput(e.target.value))
                if (error) setError(null)
              }}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">El monto mínimo permitido es 101</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit-due-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de vencimiento
            </Label>
            <Input
              id="limit-due-date"
              type="date"
              min={today}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value)
                if (error) setError(null)
              }}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Establecer límite
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

