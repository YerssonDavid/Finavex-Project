"use client"

import type React from "react"
import { useFormForgotPassword } from "@/login/password/Logic/LogicForgotPassword"
import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import Link from "next/link"

/**
 * Componente ForgotPassword
 *
 * Este componente maneja el formulario de recuperación de contraseña
 *
 * Funcionalidades:
 * - Input de email con validación Zod
 * - Envío de datos al backend: POST /Users/forgot-password
 * - Manejo de errores y éxito
 * - Redirección automática tras éxito
 */
export default function ForgotPasswordComponent() {

    const {
        register,
        onSubmit,
        handleSubmit,
        errors,
        isSubmitting,
        reset
    } = useFormForgotPassword();

    return (
        <div className="min-h-screen">
            <AnimatedBackground />
            <Navigation />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-lg border-border/50">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Recuperar Contraseña</CardTitle>
                        <CardDescription className="text-base">
                            Ingresa tu email para recibir instrucciones de recuperación
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Campo de Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    {...register("email")}
                                    required
                                    className="h-11"
                                />

                                {/* Mostrar error si existe */}
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Botón Enviar */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            >
                                {isSubmitting ? "Enviando..." : "Enviar Instrucciones"}
                            </Button>

                            {/* Link volver a Login */}
                            <div className="text-center text-sm text-muted-foreground">
                                ¿Ya recordaste tu contraseña?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </div>

                            {/* Link a Registro */}
                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tienes cuenta?{" "}
                                <Link
                                    href="/register"
                                    className="text-primary hover:underline font-medium"
                                >
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

