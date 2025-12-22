"use client"

import type React from "react"
import { useFormChangePassword } from "@/login/password/Logic/LogicChangePassword"
import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"
import Link from "next/link"

/**
 * Componente ChangePassword
 *
 * Este componente maneja el formulario de cambio de contraseña
 *
 * Funcionalidades:
 * - Input de nueva contraseña con validación Zod
 * - Input de confirmación de contraseña (siempre oculto)
 * - Indicadores visuales de requisitos de contraseña
 * - Envío de datos al backend: POST /Users/change-password
 * - Manejo de errores y éxito
 * - Redirección automática tras éxito
 *
 * Ruta: http://localhost:3000/login/password/change
 */
export default function ChangePasswordComponent() {

    const {
        register,
        onSubmit,
        handleSubmit,
        errors,
        isSubmitting,
    } = useFormChangePassword();

    return (
        <div className="min-h-screen">
            <AnimatedBackground />
            <Navigation />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-lg border-border/50">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <KeyRound className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Cambiar Contraseña</CardTitle>
                        <CardDescription className="text-base">
                            Ingresa tu nueva contraseña
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Campo Nueva Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("newPassword")}
                                    required
                                    className="h-11"
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                                )}
                            </div>

                            {/* Indicadores de requisitos de contraseña */}
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                    Requisitos de contraseña:
                                </p>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Mínimo 8 caracteres
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Al menos una letra mayúscula
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Al menos una letra minúscula
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Al menos un número
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Al menos un carácter especial (!@#$%...)
                                    </li>
                                </ul>
                            </div>

                            {/* Campo Confirmar Nueva Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                                <Input
                                    id="confirmNewPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmNewPassword")}
                                    required
                                    className="h-11"
                                />
                                {errors.confirmNewPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmNewPassword.message}</p>
                                )}
                            </div>

                            {/* Botón Enviar */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            >
                                {isSubmitting ? "Cambiando Contraseña..." : "Cambiar Contraseña"}
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
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

