"use client"

import type React from "react"

import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Loader2 } from "lucide-react"
import Link from "next/link"
import {useFormLoginUser} from "@/login/Logic/LogicLoginUser";
import { useState, useEffect } from "react"

// Función auxiliar para convertir segundos a formato MM:SS
const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default function LoginPage() {

  const {register, onSubmit, handleSubmit, errors, isSubmitting, reset, isAccountLocked, remainingTime} = useFormLoginUser();
  const [showLoading, setShowLoading] = useState(false);

  // Verificar si hay un proceso de carga activo al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoading = localStorage.getItem('isLoadingHomePersonal');
      if (isLoading === 'true') {
        setShowLoading(true);
      }
    }
  }, []);

  // Mostrar loading si está cargando o si hay un proceso activo
  if (isSubmitting || showLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />

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
                Iniciando sesión
              </h2>
              <p className="text-muted-foreground text-sm">
                Preparando tu espacio financiero...
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
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-lg border-border/50">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-base">Ingresa a tu cuenta de Finavex</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Mostrar alerta de bloqueo si la cuenta está bloqueada */}
              {isAccountLocked && (
                <div className="p-4 mb-4 rounded-lg bg-destructive/20 border border-destructive/50">
                  <p className="text-sm font-semibold text-destructive">
                    ⏸️ Cuenta bloqueada por seguridad
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">
                    Intenta nuevamente en <span className="font-bold">{formatTimeRemaining(remainingTime)}</span>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                  disabled={isAccountLocked}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/login/password" className="text-xs text-primary hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isAccountLocked}
                  required
                  className="h-11"
                />
              </div>

              <Button
                  type="submit"
                  disabled={isSubmitting || isAccountLocked}
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  {isAccountLocked
                    ? `Bloqueado - Intenta en ${formatTimeRemaining(remainingTime)}`
                    : isSubmitting
                    ? "Iniciando Sesión..."
                    : "Iniciar sesión"
                  }
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
