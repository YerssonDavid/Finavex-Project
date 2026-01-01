"use client"

import { Card } from "@/components/ui/card"
import { Newspaper, TrendingUp, AlertTriangle, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const newsItems = [
  {
    id: 1,
    title: "Mercado alcista en tecnología",
    description: "Las acciones tecnológicas suben un 5% esta semana impulsadas por resultados positivos.",
    icon: TrendingUp,
    color: "from-success to-success/70",
    time: "Hace 2 horas",
    content:
      "El sector tecnológico ha experimentado un crecimiento significativo esta semana, con empresas líderes reportando ganancias superiores a las esperadas. Los analistas predicen que esta tendencia continuará en el próximo trimestre.",
  },
  {
    id: 2,
    title: "Alerta: Inflación en aumento",
    description: "Los índices de inflación muestran un incremento del 0.3% respecto al mes anterior.",
    icon: AlertTriangle,
    color: "from-destructive to-destructive/70",
    time: "Hace 5 horas",
    content:
      "Los datos económicos recientes indican un aumento en la inflación, lo que podría afectar las decisiones de inversión. Los expertos recomiendan diversificar las carteras y considerar activos protegidos contra la inflación.",
  },
  {
    id: 3,
    title: "Nueva función: Ahorro inteligente",
    description: "Descubre cómo nuestra IA puede ayudarte a ahorrar más cada mes automáticamente.",
    icon: Sparkles,
    color: "from-accent to-accent/70",
    time: "Hace 1 día",
    content:
      "Hemos lanzado una nueva función de ahorro inteligente que utiliza inteligencia artificial para analizar tus patrones de gasto y sugerir oportunidades de ahorro personalizadas. Actívala desde tu perfil.",
  },
  {
    id: 4,
    title: "Criptomonedas en volatilidad",
    description: "Bitcoin y Ethereum experimentan fluctuaciones significativas en las últimas 24 horas.",
    icon: TrendingUp,
    color: "from-secondary to-secondary/70",
    time: "Hace 2 días",
    content:
      "El mercado de criptomonedas ha mostrado alta volatilidad, con Bitcoin fluctuando entre $42,000 y $45,000. Los traders recomiendan precaución y estrategias de gestión de riesgo.",
  },
]

interface NewsSectionProps {
  onNewsClick: (news: (typeof newsItems)[0]) => void
}

export function NewsSection({ onNewsClick }: NewsSectionProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-[20px] border-white/20 p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Últimas noticias</h2>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {newsItems.map((news, index) => {
            const Icon = news.icon
            return (
              <button
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${news.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 text-balance group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 text-pretty">{news.description}</p>
                    <span className="text-xs text-muted-foreground/70 mt-1 inline-block">{news.time}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
