"use client"

import type React from "react"

import {Navigation} from "@/components/landing/navigation"
import {AnimatedBackground} from "@/components/landing/animated-background"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {UserPlus} from "lucide-react"
import Link from "next/link"
import {useFormUser} from "@/register/Logic/logicFormUser"
import {Confetti} from "@neoconfetti/react";
import {ButtonShowPassword} from "@/components/ui/button-show-password";

export default function RegisterPage() {
    const {register, handleSubmit, onSubmit, errors, isSubmitting, confettiActive, reset} = useFormUser()

    return (
        <div className="min-h-screen">
            <AnimatedBackground/>
            <Navigation/>

            <div className="container mx-auto px-4 pt-32 pb-20">
                <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-lg border-border/50">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <UserPlus className="h-8 w-8 text-primary"/>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Crear Cuenta</CardTitle>
                        <CardDescription className="text-base">Comienza tu transformación financiera
                            hoy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {confettiActive &&
                            <Confetti force={1} particleCount={300}/>
                        }
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="nombre"
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
                                    placeholder="opcional"
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
                                    placeholder="Apellido"
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
                                    placeholder="opcional"
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

                            <ButtonShowPassword id="password" label="Contraseña" register={register}
                                                fieldName={"password"} errors={errors}/>

                            <ButtonShowPassword
                                id="confirmPassword"
                                label="Confirmar Contraseña"
                                register={register}
                                fieldName={"confirmPassword"}
                                errors={errors}
                                holdToShow={true}
                            />

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
