"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, DollarSign, Loader2, CheckCircle2, AlertCircle, Sparkles, PiggyBank } from "lucide-react"
import { cleanAmountInput, formatAmountWithThousands } from "@/lib/formatters"

interface SavingMovementModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  onSubmit: (amount: number) => Promise<void>
}

export function SavingMovementModal({ isOpen, onClose, planName, onSubmit }: SavingMovementModalProps) {
  const [amount, setAmount] = useState("") // Valor real sin formato
  const [displayAmount, setDisplayAmount] = useState("") // Valor mostrado con formato
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Montar el portal solo en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Enfocar el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setError("")
      setIsSuccess(false)
      setAmount("")
      setDisplayAmount("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Por favor ingresa un monto válido mayor a 0")
      return
    }

    if (numAmount > 99000000000) {
      setError("El monto no puede ser mayor a $99'000.000.000")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onSubmit(numAmount)
      setIsLoading(false)
      setIsSuccess(true)

      // Cerrar automáticamente después de mostrar éxito
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrar el movimiento"
      setError(errorMessage)
      setIsSuccess(false)
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return // No cerrar si está cargando
    setAmount("")
    setDisplayAmount("")
    setError("")
    setIsSuccess(false)
    onClose()
  }

  // Manejar cambio en el input de monto
  const handleAmountChange = (value: string) => {
    const cleaned = cleanAmountInput(value)
    if (cleaned === null) return

    // Guardar el valor real (sin formato)
    setAmount(cleaned)

    // Mostrar el valor formateado
    setDisplayAmount(formatAmountWithThousands(cleaned))
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-lg
          bg-white dark:bg-gray-900 
          rounded-2xl shadow-2xl
          border border-gray-200 dark:border-gray-700
          overflow-hidden
          animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
          ${isSuccess ? 'ring-4 ring-green-500/50' : ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
          {/* Efectos decorativos */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Sparkles className="absolute top-4 right-16 w-5 h-5 text-white/30 animate-pulse" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Registrar Ahorro
                </h2>
                <p className="text-white/70 text-sm">
                  Plan: {planName}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Estado de éxito */}
          {isSuccess && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">¡Ahorro registrado!</p>
                <p className="text-sm text-green-600 dark:text-green-400">El movimiento ha sido guardado</p>
              </div>
            </div>
          )}

          {/* Campo de monto */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <DollarSign className="w-4 h-4" />
              Monto a ahorrar
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 dark:text-gray-500">
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={displayAmount}
                onChange={(e) => {
                  handleAmountChange(e.target.value)
                  setError("")
                }}
                className={`
                  w-full pl-12 pr-4 py-4 
                  text-2xl font-bold
                  bg-gray-50 dark:bg-gray-800
                  border-2 rounded-xl 
                  transition-all duration-200
                  placeholder:text-gray-300 dark:placeholder:text-gray-600
                  text-gray-900 dark:text-white
                  ${error 
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  }
                  focus:outline-none
                `}
                placeholder="0"
                disabled={isLoading || isSuccess}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="
                flex-1 px-6 py-4
                border-2 border-gray-200 dark:border-gray-700
                rounded-xl
                font-semibold text-gray-700 dark:text-gray-300
                bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700
                hover:border-gray-300 dark:hover:border-gray-600
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading || isSuccess || !amount}
              className="
                flex-1 px-6 py-4
                rounded-xl
                font-bold text-white
                flex items-center justify-center gap-2
                transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>¡Listo!</span>
                </>
              ) : (
                <span>Registrar Ahorro</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

