import type React from "react"
import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Shield, Zap, BarChart3, Bell, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4 animate-fade-in">
            Tu futuro financiero comienza aquí
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-fade-in-up">
            Transforma tu{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              futuro financiero
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Finavex pone en tus manos una plataforma completa para gestionar tus finanzas de manera profesional,
            completamente gratuita y con la seguridad que mereces.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 h-14"
            >
              <Link href="/register">Comenzar Gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 h-14 bg-transparent">
              <Link href="/about">Conocer Más</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Visualización Clara"
            description="Gráficos intuitivos y reportes detallados que transforman números complejos en información accionable."
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8" />}
            title="Noticias Diarias"
            description="IA que analiza y entrega noticias económicas relevantes de Colombia cada 24 horas."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Proyecciones Inteligentes"
            description="Anticipamos tu futuro económico con análisis predictivos avanzados."
          />
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Seguimiento Automatizado"
            description="Monitoreo continuo de gastos e ingresos sin esfuerzo manual."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Seguridad Bancaria"
            description="Encriptación de nivel bancario para proteger tus datos financieros."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="100% Gratuito"
            description="Todas las funciones profesionales sin costo alguno, para siempre."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            El futuro que deseas está a un registro de distancia
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Tu transformación financiera comienza hoy, y es completamente gratuita.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-12 h-14"
          >
            <Link href="/register">Crear Cuenta Gratis</Link>
          </Button>
        </Card>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur border-border/50">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  )
}
