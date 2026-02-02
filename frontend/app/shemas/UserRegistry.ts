import {z} from 'zod';

//Schema for validation of user registration form
export const userRegistrySchema = z.object({
    name: z.string().min(1, 'Nombre es obligatorio'),
    middleName: z.string().optional(),
    surname: z.string().min(1, 'Apellido es obligatorio'),
    secondSurname: z.string().optional(),
    documentNumber: z.number().min(100000, 'Número de documento inválido').max(9999999999, 'Número de documento inválido'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').refine((dateString) => {
        //Convert string to Date for validation
        const date = new Date(dateString + 'T00:00:00');
        //Get today's date
        const today = new Date();
        //Calculate the age
        let age = today.getFullYear() - date.getFullYear();

        //Calculate the month difference
        const month = today.getMonth() - date.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < date.getDate())) {
            age--;
        }
        return age >= 18;
    }, 'Debes ser mayor de edad'),
    phone: z.number().min(10, 'El número de teléfono debe tener al menos 10 dígitos'),
    email: z.string().email('Correo Electronico invalido'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path:["confirmPassword"]
});

export type userRegistryType = z.infer<typeof userRegistrySchema>;