import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, forgotPasswordType } from "@/shemas/ForgotPassword";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export const useFormForgotPassword = () => {

    const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<forgotPasswordType> ({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const router = useRouter();

    const onSubmit = async (data : forgotPasswordType) => {
        try {
            // Enviar email al backend para recuperación de contraseña
            const response = await fetch("http://localhost:8080/Users/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error("Error al recuperar contraseña! -> ", {errorData});

                await Swal.fire({
                    title: "Error",
                    text: errorData.message || 'No pudimos encontrar tu cuenta. Verifica el email.',
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            const resp = await response.json();

            console.log("Email de recuperación enviado!");
            reset();

            // Mostrar alerta de éxito
            await Swal.fire({
                title: "¡Éxito!",
                text: resp.message || 'Se ha enviado un email con las instrucciones para recuperar tu contraseña.',
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error){
            console.error("El error -> ", {error});

            await Swal.fire({
                title: "Error",
                text: (error as Error).message || String(error),
                icon: "error",
                timer: 3000
            });
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        reset
    };
};

