"use client"

import type React from "react"

import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import Link from "next/link"
import {useFormLoginUser} from "@/login/Logic/LogicLoginUser";

// Función auxiliar para convertir segundos a formato MM:SS
const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default function LoginPage() {

  const {register, onSubmit, handleSubmit, errors, isSubmitting, reset, isAccountLocked, remainingTime} = useFormLoginUser();

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
