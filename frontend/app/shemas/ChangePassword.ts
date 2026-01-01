import { z } from 'zod';

/**
 * Esquema de validación para cambio de contraseña
 *
 * Validaciones:
 * - newPassword: Mismas reglas que la contraseña de registro
 *   - Mínimo 8 caracteres
 *   - Al menos una mayúscula
 *   - Al menos una minúscula
 *   - Al menos un número
 *   - Al menos un carácter especial
 *
 * - confirmNewPassword: Debe coincidir con newPassword
 * - email: Email recuperado del localStorage (no visible para el usuario)
 */
export const changePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
    confirmNewPassword: z.string(),
    email: z.string().email('Email inválido').optional(), // Email recuperado del localStorage
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ["confirmNewPassword"]
});

export type changePasswordType = z.infer<typeof changePasswordSchema>;

