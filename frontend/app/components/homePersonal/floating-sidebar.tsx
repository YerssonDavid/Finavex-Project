"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, ArrowLeftRight, Wallet, AlertCircle, Target, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react"

const menuItems = [
  { icon: User, label: "Perfil", color: "from-primary to-primary/70" },
  { icon: ArrowLeftRight, label: "Movimientos", color: "from-secondary to-secondary/70" },
  { icon: Wallet, label: "Presupuesto", color: "from-accent to-accent/70" },
  { icon: AlertCircle, label: "Límites", color: "from-destructive to-destructive/70" },
  { icon: Target, label: "Metas", color: "from-success to-success/70" },
  { icon: Lightbulb, label: "Tips", color: "from-chart-3 to-chart-3/70" },
]

interface FloatingSidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function FloatingSidebar({ onCollapseChange }: FloatingSidebarProps) {
  const [activeItem, setActiveItem] = useState("Perfil")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    onCollapseChange?.(collapsed)
  }

  return (
    <>
      <aside
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-in-out ${
          isCollapsed ? "-translate-x-[calc(100%+2rem)] opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="bg-popover/95 backdrop-blur-[40px] rounded-2xl p-4 shadow-2xl border border-white/20 shadow-[0_0_20px_rgba(100,200,255,0.3)] hover:shadow-[0_0_40px_rgba(100,200,255,0.6)] transition-shadow duration-[3s]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCollapse(true)}
            className="h-10 w-full mb-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <ChevronLeft className="h-5 w-5 text-foreground/70 dark:text-white/90 group-hover:text-foreground dark:group-hover:text-white transition-colors" />
          </Button>

          <nav className="flex flex-col gap-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeItem === item.label

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveItem(item.label)}
                  className={`
                    relative h-14 w-14 rounded-xl transition-all duration-300 group
                    ${isActive ? "bg-gradient-to-br " + item.color : "hover:bg-white/10"}
                  `}
                >
                  <Icon
                    className={`h-6 w-6 transition-all duration-300 ${
                      isActive
                        ? "text-white scale-110"
                        : "text-foreground/70 dark:text-white/90 group-hover:scale-110 group-hover:text-foreground dark:group-hover:text-white"
                    }`}
                  />

                  {/* Tooltip */}
                  <span className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg border border-border">
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                  )}
                </Button>
              )
            })}
          </nav>
        </div>
      </aside>

      <button
        onClick={() => handleCollapse(false)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-in-out ${
          isCollapsed ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } group`}
        aria-label="Expandir menú"
      >
        <div className="bg-popover/95 backdrop-blur-[40px] rounded-r-xl p-2 shadow-2xl border-r border-t border-b border-white/20 hover:shadow-[0_0_20px_rgba(100,200,255,0.5)] transition-all duration-300 hover:pr-3 ml-0 mr-2.5 pl-[5px]">
          <ChevronRight className="h-6 w-6 text-foreground/70 dark:text-white/90 group-hover:text-primary transition-colors" />
        </div>
      </button>
    </>
  )
}
