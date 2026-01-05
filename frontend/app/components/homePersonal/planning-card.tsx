"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Target, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const goals = [
  {
    name: "Fondo de emergencia",
    current: 15000,
    target: 20000,
    color: "from-primary to-primary/70",
    icon: Target,
  },
  {
    name: "Vacaciones 2026",
    current: 3500,
    target: 8000,
    color: "from-accent to-accent/70",
    icon: Calendar,
  },
  {
    name: "Inversión inmobiliaria",
    current: 42000,
    target: 100000,
    color: "from-secondary to-secondary/70",
    icon: TrendingUp,
  },
]

export function PlanningCard() {
  return (
    <Card className="glass border-white/20 p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Planeación</h2>
        </div>

        <div className="space-y-5">
          {goals.map((goal, index) => {
            const Icon = goal.icon
            const percentage = Math.round((goal.current / goal.target) * 100)

            return (
              <div
                key={goal.name}
                className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:from-white/10 hover:to-white/20 transition-all duration-300 animate-in fade-in slide-in-from-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-balance">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        ${goal.current.toLocaleString()} de ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">{percentage}%</span>
                </div>

                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total ahorrado</span>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              $60,500
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
