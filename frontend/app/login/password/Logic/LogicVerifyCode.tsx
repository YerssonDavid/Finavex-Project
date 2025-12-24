import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeSchema, verifyCodeType } from "@/shemas/VerifyCode";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export const useFormVerifyCode = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<verifyCodeType>({
        resolver: zodResolver(verifyCodeSchema),
    });

    const router = useRouter();

    const onSubmit = async (data: verifyCodeType) => {
        try {
            // Recuperar el email guardado en localStorage
            const recoveryEmail = localStorage.getItem('recovery_email');

            if (!recoveryEmail) {
                await Swal.fire({
                    title: "Error",
                    text: 'No se encontró el email de recuperación. Por favor, inicia el proceso nuevamente.',
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                router.push('/login/password/forgot');
                return;
            }

            // Enviar código y email al backend para verificación
            const response = await fetch("http://localhost:8080/recover-password/code-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: data.code,
                    email: recoveryEmail
                })
            });

            if (!response.ok) {
                // Manejar respuestas de error con o sin JSON
                let errorMessage = 'Código inválido o expirado.';

                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                        console.error("Error al verificar código -> ", { errorData });
                    }
                } catch (parseError) {
                    console.error("Error al parsear respuesta de error -> ", { parseError });
                }

                await Swal.fire({
                    title: "Error",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            // Manejar respuesta exitosa (puede ser vacía o con JSON)
            let responseData = null;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const responseText = await response.text();
                if (responseText && responseText.trim().length > 0) {
                    try {
                        responseData = JSON.parse(responseText);
                        console.log("Código verificado exitosamente -> ", { responseData });
                    } catch (parseError) {
                        console.warn("No se pudo parsear la respuesta JSON, pero el código es válido");
                    }
                }
            }

            reset();

            await Swal.fire({
                title: "¡Código Verificado!",
                text: 'Ahora puedes cambiar tu contraseña.',
                icon: "success",
                confirmButtonText: "Continuar"
            });

            // Redirigir a la página de cambio de contraseña
            router.push('/login/password/change');

        } catch (error) {
            console.error("Error al verificar código -> ", { error });

            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error inesperado. Intenta nuevamente.",
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

