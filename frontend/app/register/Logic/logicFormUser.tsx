import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrySchema, userRegistryType } from "@/shemas/UserRegistry";
import Swal from 'sweetalert2';
import { Confetti } from '@neoconfetti/react';
import {useState} from 'react';


type errorResponse = {
    message: string;
    code: string;
}

// Mapeo de códigos de error a títulos y mensajes amigables
const ERROR_MESSAGES: Record<string, { title: string; icon: 'warning' | 'error' }> = {
    'USER_EXISTS': {
        title: 'Usuario Existente',
        icon: 'warning'
    },
    'INVALID_EMAIL': {
        title: 'Email Inválido',
        icon: 'warning'
    },
    'WEAK_PASSWORD': {
        title: 'Contraseña Débil',
        icon: 'warning'
    },
    'VALIDATION_ERROR': {
        title: 'Error de Validación',
        icon: 'warning'
    },
};

export const useFormUser = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<userRegistryType>({
        resolver: zodResolver(userRegistrySchema)
    });

    const [confettiActive, setConfettiActive] = useState(false);

    const onSubmit = async (data: userRegistryType) => {
        try {
            //send the data to the backend
            const response = await fetch("http://localhost:8080/Users/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                //Validate data in JSON format - la fecha ya viene en formato ISO 8601 (YYYY-MM-DD)
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData: errorResponse = await response.json().catch(() => ({
                    message: 'Error desconocido del servidor',
                    code: 'UNKNOWN_ERROR'
                }));

                // AQUÍ DIFERENCIAMOS POR CÓDIGO
                const errorConfig = ERROR_MESSAGES[errorData.code];

                if (errorConfig) {
                    // Si existe configuración para este código, mostrar alerta específica
                    await Swal.fire({
                        title: errorConfig.title,
                        text: errorData.message,
                        icon: errorConfig.icon,
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    // Si no existe configuración, mostrar error genérico
                    await Swal.fire({
                        title: 'Error Registro',
                        text: errorData.message || 'Intenta nuevamente más tarde',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }

                return; // ← Salir aquí, no lanzar excepción
            }

            const result = await response.json();
            console.log(`Usuario creado:`, result);
            reset();

            setConfettiActive(true);

            await Swal.fire({
                title: 'Registro Exitoso',
                text: '¡Bienvenido a Finavex! Tu cuenta ha sido creada exitosamente.',
                icon: 'success',
                timer: 3000,
                confirmButtonText: 'Aceptar'
            });

            setTimeout(()=> setConfettiActive(false), 3000);

        } catch (error) {
            console.error(error);

            //Show error alert in the screen - para errores inesperados
            await Swal.fire({
                title: 'Error Registro',
                text: 'Intenta nuevamente más tarde, ¡Disculpa las molestias!',
                icon: 'error',
                timer: 3000,
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        confettiActive,
        reset
    };
};
