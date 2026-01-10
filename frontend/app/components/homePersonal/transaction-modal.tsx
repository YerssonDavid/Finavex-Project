"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, DollarSign, FileText, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "income" | "expense"
  onSubmit: (amount: number, note?: string) => Promise<void>
}

export function TransactionModal({ isOpen, onClose, type, onSubmit }: TransactionModalProps) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isIncome = type === "income"

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

  // Resetear estados cuando cambia el tipo
  useEffect(() => {
    setError("")
    setIsSuccess(false)
  }, [type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Por favor ingresa un monto válido mayor a 0")
      return
    }

    if (numAmount > 999999999) {
      setError("Oww, eso es mucho dinero! Por favor ingresa un monto menor a 1,000,000,000")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onSubmit(numAmount, note.trim() || undefined)
      setIsSuccess(true)

      // Cerrar automáticamente después de mostrar éxito
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrar el movimiento"
      setError(errorMessage)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return // No cerrar si está cargando
    setAmount("")
    setNote("")
    setError("")
    setIsSuccess(false)
    onClose()
  }

  // Formatear el monto mientras se escribe
  const formatAmount = (value: string) => {
    // Permitir solo números y un punto decimal
    const cleaned = value.replace(/[^0-9.]/g, "")
    const parts = cleaned.split(".")
    if (parts.length > 2) return amount // No permitir más de un punto
    if (parts[1] && parts[1].length > 2) return amount // Máximo 2 decimales
    return cleaned
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
          <div
            className={`
              relative px-6 py-5 
              ${isIncome 
                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500' 
                : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500'
              }
            `}
          >
            {/* Efectos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <Sparkles className="absolute top-4 right-16 w-5 h-5 text-white/30 animate-pulse" />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {isIncome ? "+" : "−"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isIncome ? "Nuevo Ingreso" : "Nuevo Gasto"}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {isIncome ? "Registra un ingreso a tu cuenta" : "Registra un gasto de tu cuenta"}
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
                  <p className="font-semibold text-green-800 dark:text-green-300">¡Registrado exitosamente!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">El movimiento ha sido guardado</p>
                </div>
              </div>
            )}

            {/* Campo de monto */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <DollarSign className="w-4 h-4" />
                Monto
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
                  value={amount}
                  onChange={(e) => {
                    setAmount(formatAmount(e.target.value))
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
                      : isIncome
                        ? "border-gray-200 dark:border-gray-700 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                    }
                    focus:outline-none
                  `}
                  placeholder="0.00"
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

            {/* Campo de nota */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <FileText className="w-4 h-4" />
                Nota
                <span className="text-gray-400 font-normal text-xs">(opcional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                className={`
                  w-full px-4 py-3
                  bg-gray-50 dark:bg-gray-800
                  border-2 border-gray-200 dark:border-gray-700
                  rounded-xl resize-none
                  text-gray-900 dark:text-white
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  transition-all duration-200
                  focus:outline-none
                  ${isIncome 
                    ? "hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20" 
                    : "hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                  }
                `}
                placeholder="Ej: Pago de servicios, Salario mensual..."
                rows={3}
                disabled={isLoading || isSuccess}
              />
              <div className="text-right text-xs text-gray-400">
                {note.length}/100 caracteres
              </div>
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
                className={`
                  flex-1 px-6 py-4 
                  rounded-xl 
                  font-bold text-white
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${isIncome
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                  }
                `}
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
                  <span>Registrar {isIncome ? "Ingreso" : "Gasto"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
