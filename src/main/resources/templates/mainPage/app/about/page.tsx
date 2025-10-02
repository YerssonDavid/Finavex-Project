import type React from "react"
import { Navigation } from "@/components/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, Users, AlertCircle, CreditCard } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Introduction Section */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
              Sobre{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Finavex
              </span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </section>

          {/* Main Introduction */}
          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur border-border/50">
            <h2 className="text-3xl font-bold mb-6">Introducción</h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Bienvenido a <span className="text-foreground font-semibold">Finavex</span>, tu aliado inteligente para
                transformar tu futuro financiero. En un mundo donde cada decisión económica define tu destino, Finavex
                pone en tus manos una plataforma completa con todos los apartados esenciales para gestionar tus finanzas
                de manera profesional, completamente gratuita y con la seguridad que mereces.
              </p>
              <p>
                Imagina despertar cada día con claridad total sobre tu situación financiera. Finavex hace esto realidad
                con secciones especializadas que te permiten visualizar cada aspecto de tu economía a través de gráficos
                intuitivos, reportes detallados y paneles de control que transforman números complejos en información
                clara y accionable. Pero vamos más allá: cada 24 horas, un agente de inteligencia artificial analiza y
                te entrega las noticias económicas más relevantes de Colombia, manteniéndote siempre informado sobre los
                movimientos del mercado que pueden impactar tu bolsillo.
              </p>
              <p>
                Con Finavex, no solo administras tu dinero: construyes el camino hacia la libertad financiera que
                siempre has soñado. Desde el seguimiento automatizado de gastos hasta proyecciones inteligentes que
                anticipan tu futuro económico, cada función está diseñada para empoderarte con el conocimiento y la
                claridad que necesitas para tomar decisiones financieras inteligentes. Tus datos están protegidos con
                encriptación de nivel bancario, porque tu confianza es nuestra prioridad.
              </p>
              <p className="text-foreground font-semibold text-xl pt-4">
                El futuro que deseas está a un registro de distancia. Tu transformación financiera comienza hoy, y es
                completamente gratuita.
              </p>
            </div>
          </Card>

          {/* Reasons Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Motivos de la Creación</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                La realidad financiera de los jóvenes adultos colombianos revela una crisis silenciosa que demanda
                soluciones urgentes e innovadoras.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <StatCard
                icon={<TrendingDown className="h-8 w-8" />}
                percentage="68%"
                description="de jóvenes entre 18 y 35 años no tienen un plan de ahorro estructurado"
              />
              <StatCard
                icon={<AlertCircle className="h-8 w-8" />}
                percentage="54%"
                description="admite desconocer conceptos básicos de educación financiera"
              />
              <StatCard
                icon={<CreditCard className="h-8 w-8" />}
                percentage="43%"
                description="destinan más del 50% de sus ingresos al pago de deudas"
              />
              <StatCard
                icon={<Users className="h-8 w-8" />}
                percentage="32%"
                description="de jóvenes profesionales logra ahorrar mensualmente"
              />
            </div>

            <Card className="p-8 md:p-12 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Las cifras son aún más alarmantes cuando analizamos el endeudamiento: cerca del 43% de los millennials
                  y centennials colombianos destinan más del 50% de sus ingresos al pago de deudas, principalmente
                  tarjetas de crédito con tasas de interés elevadas. La Asociación Bancaria de Colombia reporta que el
                  índice de morosidad en este segmento poblacional ha aumentado un 23% en los últimos tres años,
                  evidenciando la falta de herramientas adecuadas para gestionar el dinero.
                </p>
                <p>
                  Adicionalmente, solo el 32% de los jóvenes profesionales colombianos logra ahorrar mensualmente, y de
                  estos, menos del 15% tiene un fondo de emergencia que cubra al menos tres meses de gastos. Esta
                  vulnerabilidad financiera se traduce en estrés, oportunidades perdidas y un futuro económico incierto.
                </p>
                <p className="text-foreground font-semibold text-xl pt-4">
                  Finavex nace como respuesta directa a esta problemática, democratizando el acceso a herramientas
                  financieras sofisticadas que antes estaban reservadas para asesores privados costosos. Nuestra misión
                  es clara: guiar a cada persona hacia el equilibrio perfecto entre tranquilidad financiera y control
                  absoluto de su economía.
                </p>
              </div>
            </Card>
          </section>

          {/* CTA Section */}
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Únete a la Revolución Financiera</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Esta plataforma web es solo el comienzo de una evolución tecnológica sin límites, diseñada para crecer y
              adaptarse continuamente.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-12 h-14"
            >
              <Link href="/register">Comenzar Ahora</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  percentage,
  description,
}: { icon: React.ReactNode; percentage: string; description: string }) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="text-destructive">{icon}</div>
        <div>
          <div className="text-4xl font-bold text-foreground mb-2">{percentage}</div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  )
}
