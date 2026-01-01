import { z } from 'zod';

// Esquema para validación de formulario "Olvidé mi contraseña"
export const forgotPasswordSchema = z.object({
    email: z.string().email('Correo Electronico invalido'),
});

export type forgotPasswordType = z.infer<typeof forgotPasswordSchema>;

