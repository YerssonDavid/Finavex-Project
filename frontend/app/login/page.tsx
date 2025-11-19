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
import { useState } from "react"
import {useForm} from "react-hook-form";
import {useFormLoginUser} from "@/login/Logic/LogicLoginUser";

export default function LoginPage() {
  /*const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")*/

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email })
    // Add authentication logic here
  }*/
  const {register, onSubmit, handleSubmit, errors, isSubmitting, reset} = useFormLoginUser();

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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  required
                  className="h-11"
                />
              </div>

              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  {isSubmitting ?
                      "Iniciando  Sesión..."  : "Iniciar sesión"
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
