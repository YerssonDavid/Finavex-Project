"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/homePersonal/theme-provider"

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { theme, themeStyle, setTheme, setThemeStyle } = useTheme()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const themes = [
    { value: "light" as const, label: "Claro", preview: "bg-gradient-to-br from-white to-gray-100" },
    { value: "dark" as const, label: "Oscuro", preview: "bg-gradient-to-br from-gray-900 to-black" },
  ]

  const themeStyles = [
    {
      value: "masculine" as const,
      preview: "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600",
    },
    {
      value: "feminine" as const,
      preview: "bg-gradient-to-br from-pink-300 via-purple-300 to-rose-400",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 animate-in zoom-in slide-in-from-bottom duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Configuración
          </h2>
          <p className="text-muted-foreground">Personaliza tu experiencia</p>
        </div>

        {/* Theme Mode Selection */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Modo</h3>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                    ${
                      theme === t.value
                        ? "border-primary shadow-lg shadow-primary/50"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <div className={`w-full h-20 rounded-lg ${t.preview} mb-3 shadow-inner`} />
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  {theme === t.value && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-in zoom-in" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Style Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Estilo de color</h3>
            <div className="grid grid-cols-2 gap-4">
              {themeStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setThemeStyle(style.value)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                    ${
                      themeStyle === style.value
                        ? "border-primary shadow-lg shadow-primary/50"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <div className={`w-full h-20 rounded-lg ${style.preview} shadow-inner`} />
                  {themeStyle === style.value && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-in zoom-in shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
