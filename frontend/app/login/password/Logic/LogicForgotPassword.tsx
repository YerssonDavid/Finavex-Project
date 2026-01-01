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
            const response = await fetch("http://localhost:8080/code-recovery/send-code", {
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

            // Guardar el email en localStorage para usarlo en la verificación del código
            localStorage.setItem('recovery_email', data.email);

            reset();

            await Swal.fire({
                title: "¡Éxito!",
                text: 'Se ha enviado un código de recuperación a tu email.',
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            router.push('/login/password/verify');
            return;

        } catch (error){
            if(String(error) === "TypeError: Failed to fetch"){
                await Swal.fire({
                    title: "Error",
                    text: 'Ups, tenemos problemas galacticos. Intenta en un rato!',
                    icon: "error",
                    timer: 3000
                });
                return;
            }
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
