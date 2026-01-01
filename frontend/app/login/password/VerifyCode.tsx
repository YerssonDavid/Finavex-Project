"use client"

import { useFormVerifyCode } from "@/login/password/Logic/LogicVerifyCode"
import { Navigation } from "@/components/landing/navigation"
import { AnimatedBackground } from "@/components/landing/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

/**
 * Componente VerifyCode
 *
 * Este componente maneja el formulario de verificación del código de 6 dígitos
 *
 * Funcionalidades:
 * - Input de código con validación Zod (6 dígitos)
 * - Envío de datos al backend: POST /code-recovery/verify-code
 * - Manejo de errores y éxito
 * - Redirección automática a cambio de contraseña tras éxito
 *
 * Ruta: http://localhost:3000/login/password/verify
 */
export default function VerifyCodeComponent() {

    const {
        register,
        onSubmit,
        handleSubmit,
        errors,
        isSubmitting,
    } = useFormVerifyCode();

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />
            <Navigation />

            <div className="container relative z-10 mx-auto px-4 pt-32 pb-20">
                <div className="max-w-md mx-auto">
                    {/* Botón volver */}
                    <Link
                        href="/login/password/forgot"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Link>

                    <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-xl">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Verificar Código
                            </CardTitle>
                            <CardDescription className="text-base">
                                Ingresa el código de 6 dígitos enviado a tu correo
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Campo Código de Verificación */}
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-sm font-medium">
                                        Código de Verificación
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        {...register("code")}
                                        required
                                        className="h-14 text-center text-3xl tracking-[0.5em] font-mono bg-background/50"
                                        autoComplete="off"
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                                            {errors.code.message}
                                        </p>
                                    )}
                                </div>

                                {/* Información adicional */}
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                                    <p className="text-sm text-muted-foreground text-center">
                                        ⏱️ El código expira en <span className="font-semibold text-foreground">10 minutos</span>
                                    </p>
                                </div>

                                {/* Botón Verificar */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="inline-block animate-spin mr-2">⏳</span>
                                            Verificando...
                                        </>
                                    ) : (
                                        "Verificar Código"
                                    )}
                                </Button>

                                {/* Divisor */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border/50" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            ¿Necesitas ayuda?
                                        </span>
                                    </div>
                                </div>

                                {/* Link para reenviar código */}
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        ¿No recibiste el código?
                                    </p>
                                    <Link
                                        href="/login/password/forgot"
                                        className="inline-flex items-center text-sm text-primary hover:underline font-medium transition-colors"
                                    >
                                        Reenviar código
                                    </Link>
                                </div>

                                {/* Link volver a Login */}
                                <div className="text-center pt-4 border-t border-border/50">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        ¿Ya recordaste tu contraseña?
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm text-primary hover:underline font-medium transition-colors"
                                    >
                                        Inicia sesión aquí
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
