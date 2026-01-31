import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ButtonShowPasswordProps {
    id: string;
    label: string;
    placeholder?: string;
    register: UseFormRegister<any>;
    fieldName: string;
    errors: FieldErrors;
    /** Si es true, el botón debe mantenerse presionado para ver la contraseña */
    holdToShow?: boolean;
}

export const ButtonShowPassword = ({
    id,
    label,
    placeholder = "••••••••",
    register,
    fieldName,
    errors,
    holdToShow = false
}: ButtonShowPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Handlers para modo "mantener presionado"
    const handleMouseDown = () => {
        if (holdToShow) setShowPassword(true);
    };

    const handleMouseUp = () => {
        if (holdToShow) setShowPassword(false);
    };

    const handleMouseLeave = () => {
        if (holdToShow) setShowPassword(false);
    };

    // Handlers para touch en dispositivos móviles
    const handleTouchStart = () => {
        if (holdToShow) setShowPassword(true);
    };

    const handleTouchEnd = () => {
        if (holdToShow) setShowPassword(false);
    };

    const error = errors[fieldName];

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    {...register(fieldName)}
                    className="h-11 pr-12"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute right-0 top-0 h-11 px-3 transition-all duration-200 ${
                        showPassword 
                            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                            : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
                    }`}
                    onClick={holdToShow ? undefined : togglePassword}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    title={holdToShow ? "Mantén presionado para ver" : "Click para mostrar/ocultar"}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-sm text-red-500">{error.message as string}</p>
            )}
            {holdToShow && (
                <p className="text-xs text-muted-foreground">Mantén presionado el icono para ver la contraseña</p>
            )}
        </div>
    );
};
