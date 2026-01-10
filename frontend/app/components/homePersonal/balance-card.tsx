"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <Card className="bg-card/70 backdrop-blur-[20px] border-white/20 p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground">Saldo Actual</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            {showBalance ? "$45,280.50" : "••••••"}
          </div>
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+12.5% este mes</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ingresos del mes</span>
            <span className="text-sm font-semibold text-success">+$8,450.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gastos del mes</span>
            <span className="text-sm font-semibold text-destructive">-$3,170.00</span>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso mensual</span>
            <span>68%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 animate-in slide-in-from-left"
              style={{ width: "68%" }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
