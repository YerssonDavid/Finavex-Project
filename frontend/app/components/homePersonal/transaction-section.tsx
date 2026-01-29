"use client"

import { useState } from "react"
import { Plus, Minus, TrendingUp, TrendingDown } from "lucide-react"
import { TransactionModal } from "./transaction-modal"
import { Card } from "@/components/ui/card"
import type { Transaction } from "@/types/transaction"
import { TransactionService } from "@/services/transactionService"
import Swal from "sweetalert2"
import { balanceEvents } from "@/lib/balanceEvents"

export function TransactionSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")


  const handleOpenModal = (type: "income" | "expense") => {
    setTransactionType(type)
    setIsModalOpen(true)
  }

  const handleSubmitTransaction = async (amount: number, note?: string) => {
    const transactionData: Transaction = {
      type: transactionType,
      amount,
      note,
      date: new Date().toISOString(),
    }

    console.log("📤 Enviando transacción al servidor:", transactionData)

    // 🚀 MODO PRODUCCIÓN (API Real)
    console.log("🚀 Enviando a API real...")

    // Obtener el token del usuario del localStorage o del contexto
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || undefined : undefined

    const response = await TransactionService.createTransaction(transactionData, token)

    // Verificar si la respuesta fue exitosa
    if (response.success) {
      console.log("✅ Transacción registrada exitosamente:", response.data)

      // Emitir evento para actualizar el saldo
      balanceEvents.emit()

      // Mostrar Swal después de cerrar el modal (sin await para no bloquear)
      setTimeout(() => {
        Swal.fire({
          title: transactionType === 'income' ? "Ingreso registrado" : "Gasto registrado",
          text: "✅ Movimiento registrado correctamente",
          icon: "success",
          confirmButtonText: "OK"
        })
      }, 100)
      return
    } else {
      console.error("❌ Error en la respuesta:", response.message)

      // Mostrar error con Swal
      Swal.fire({
        title: "Error al registrar",
        text: response.message || "No fue posible registrar el movimiento",
        icon: "error",
        confirmButtonText: "OK"
      })

      throw new Error(response.message || "Error al registrar")
    }
  }

  return (
    <>
      <Card className="bg-card/70 backdrop-blur-[20px] border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="mb-5">
          <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Registrar Movimiento
          </h3>
          <p className="text-sm text-muted-foreground">Añade tus ingresos y gastos rápidamente</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Botón de Ingreso */}
          <button
            onClick={() => handleOpenModal("income")}
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/25"
          >
            <div className="absolute -top-4 -right-4 opacity-20">
              <TrendingUp size={80} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors cursor-pointer">
                <Plus size={28} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">Ingreso</span>
            </div>
          </button>

          {/* Botón de Gasto */}
          <button
            onClick={() => handleOpenModal("expense")}
            className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/25"
          >
            <div className="absolute -top-4 -right-4 opacity-20">
              <TrendingDown size={80} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors cursor-pointer">
                <Minus size={28} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">Gasto</span>
            </div>
          </button>
        </div>
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={transactionType}
        onSubmit={handleSubmitTransaction}
      />
    </>
  )
}
