"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "../../../context/ContextUserData"
import Swal from 'sweetalert2'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()
  const context = useUser()

  const handleLogout = async () => {
    try {
      // Mostrar confirmación antes de cerrar sesión
      const result = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Estás seguro de que deseas cerrar sesión?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280"
      })

      if (result.isConfirmed) {
        // Limpiar datos del contexto
        if (context?.setUserData) {
          context.setUserData(null)
        }

        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userData')
          localStorage.removeItem('userId')
          localStorage.removeItem('loginAttempts')
          localStorage.removeItem('loginBlockTime')
          // Limpiar cualquier otro dato de sesión que pueda existir
          const keysToRemove = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (key.startsWith('auth') || key.startsWith('user') || key.startsWith('token'))) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key))
        }

        // Limpiar cookies de autenticación
        document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

        // Mostrar mensaje de confirmación
        await Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })

        // Redirigir al login
        router.push('/login')
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)

      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al cerrar sesión. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size="icon"
      className={`fixed top-6 left-6 z-50 h-12 w-12 rounded-xl glass-strong border border-red-500/20 shadow-2xl hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-top ${className || ''}`}
    >
      <LogOut className="h-5 w-5 text-white" />
    </Button>
  )
}
