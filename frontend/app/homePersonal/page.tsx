"use client"

import { useState, useEffect } from "react"
import { FloatingSidebar } from "@/components/homePersonal/floating-sidebar"
import { BalanceCard } from "@/components/homePersonal/balance-card"
import { NewsSection } from "@/components/homePersonal/news-section"
import { PlanningCard } from "@/components/homePersonal/planning-card"
import { NewsModal } from "@/components/homePersonal/news-modal"
import { SettingsButton } from "@/components/homePersonal/settings-button"
import { SettingsModal } from "@/components/homePersonal/settings-modal"
import { ThemeProvider } from "@/components/homePersonal/theme-provider"
import { ChatBotButton } from "@/components/homePersonal/chat-bot-button"
import { ChatBotWindow } from "@/components/homePersonal/chat-bot-window"
import { LogoutButton } from "@/components/homePersonal/logout-button"
import { TransactionSection } from "@/components/homePersonal/transaction-section"
import { useUser } from "../../context/ContextUserData"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [selectedNews, setSelectedNews] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  const context = useUser()
  const userData = context?.userData

  // Evitar error de hidratación: solo actualizar el nombre en el cliente
  useEffect(() => {
    setDisplayName(userData?.nombre || "Usuario")
  }, [userData?.nombre])

  // Desactivar loading cuando la página esté lista
  useEffect(() => {
    // Simular carga completa de recursos
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Limpiar el flag de loading del localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoadingHomePersonal');
      }
    }, 500) // Pequeño delay para asegurar que todo esté renderizado

    return () => clearTimeout(timer)
  }, [])

  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-[orbit_15s_linear_infinite]"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Contenedor centrado para el loader */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-8">
            {/* Rueda de carga con gradiente */}
            <div className="relative">
              {/* Anillo exterior con gradiente animado */}
              <div className="w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-primary via-secondary to-accent p-1 animate-spin">
                <div className="w-full h-full rounded-full bg-background/90 backdrop-blur-sm" />
              </div>

              {/* Anillo interior giratorio */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '0.8s' }} />
              </div>

              {/* Efecto de brillo pulsante */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl animate-pulse" />
            </div>

            {/* Texto de carga */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                Cargando tu espacio
              </h2>
              <p className="text-muted-foreground text-sm">
                Preparando tu información financiera...
              </p>

              {/* Puntos animados */}
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-[orbit_15s_linear_infinite]"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <SettingsButton onClick={() => setShowSettings(true)} />
        <LogoutButton />

        <div className="relative z-10 flex min-h-screen">
          <FloatingSidebar onCollapseChange={setIsSidebarCollapsed} />

          <main
            className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-500 ease-in-out ${
              isSidebarCollapsed ? "ml-[10px]" : "ml-0 sm:ml-24"
            }`}
          >
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
              <header className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-700 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 -z-10 overflow-visible">
                    <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-3xl opacity-50 animate-[orbit_15s_linear_infinite]" />
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent relative">
                    Hola {displayName || "Usuario"}
                  </h1>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg">Bienvenido a tu centro financiero personal</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="animate-in fade-in slide-in-from-left duration-700" style={{ animationDelay: "100ms" }}>
                    <BalanceCard />
                  </div>

                  <div className="animate-in fade-in slide-in-from-left duration-700" style={{ animationDelay: "400ms" }}>
                    <TransactionSection />
                  </div>
                </div>

                <div
                  className="animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: "200ms" }}
                >
                  <NewsSection onNewsClick={setSelectedNews} />
                </div>

                <div
                  className="md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-right duration-700"
                  style={{ animationDelay: "300ms" }}
                >
                  <PlanningCard />
                </div>
              </div>
            </div>
          </main>
        </div>

        {selectedNews && <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />}

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

        <ChatBotButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
        <ChatBotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </ThemeProvider>
  )
}
