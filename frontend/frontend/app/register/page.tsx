"use client"

import type React from "react"

import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useFormUser } from "@/register/Logic/logicFormUser"

export default function RegisterPage() {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useFormUser()

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-lg border-border/50">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription className="text-base">Comienza tu transformación financiera hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan"
                  {...register("name")}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Segundo Nombre (Opcional)</Label>
                <Input
                  id="middleName"
                  type="text"
                  placeholder="Carlos"
                  {...register("middleName")}
                  className="h-11"
                />
                {errors.middleName && (
                  <p className="text-sm text-red-500">{errors.middleName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Apellido</Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Pérez"
                  {...register("surname")}
                  className="h-11"
                />
                {errors.surname && (
                  <p className="text-sm text-red-500">{errors.surname.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondSurname">Segundo Apellido (Opcional)</Label>
                <Input
                  id="secondSurname"
                  type="text"
                  placeholder="García"
                  {...register("secondSurname")}
                  className="h-11"
                />
                {errors.secondSurname && (
                  <p className="text-sm text-red-500">{errors.secondSurname.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="documentNumber">Documento de Identidad</Label>
                <Input
                    id="documentNumber"
                    type="number"
                    placeholder="Identificación colombiana"
                    {...register("documentNumber", {valueAsNumber: true})}
                    className="h-11"
                />
                {errors.documentNumber && (
                    <p className="text-sm text-red-500">{errors.documentNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="18"
                  {...register("age", { valueAsNumber: true })}
                  className="h-11"
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className="h-11"
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                      id="phone"
                      type="number"
                      placeholder="3000000000"
                      {...register("phone", {valueAsNumber: true})}
                      className="h-11"
                  />
                  {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="h-11"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isSubmitting ? "Creando cuenta..." : "Crear Cuenta Gratis"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
