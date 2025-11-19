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
}

export const ButtonShowPassword = ({
    id,
    label,
    placeholder = "••••••••",
    register,
    fieldName,
    errors
}: ButtonShowPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
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
                    className="h-11 pr-10"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={togglePassword}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-sm text-red-500">{error.message as string}</p>
            )}
        </div>
    );
};
