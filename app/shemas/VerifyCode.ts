import { z } from 'zod';

// Esquema para validación del código de verificación
export const verifyCodeSchema = z.object({
    code: z.string()
        .length(6, 'El código debe tener exactamente 6 dígitos')
        .regex(/^\d+$/, 'El código solo debe contener números'),
    email: z.string().email('Email inválido').optional(), // Email recuperado del localStorage
});

export type verifyCodeType = z.infer<typeof verifyCodeSchema>;



