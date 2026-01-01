import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, changePasswordType } from "@/shemas/ChangePassword";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

/**
 * Hook personalizado para manejar la lógica del cambio de contraseña
 *
 * Funcionalidades:
 * - Validación con Zod
 * - Envío de datos al backend
 * - Manejo de errores y éxito
 * - Redirección tras éxito
 */
export const useFormChangePassword = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<changePasswordType>({
        resolver: zodResolver(changePasswordSchema),
    });

    const router = useRouter();

    /**
     * Función para enviar los datos al backend
     *
     * @param data - Datos del formulario validados
     *
     * Envía la nueva contraseña y el email recuperado del localStorage
     */
    const onSubmit = async (data: changePasswordType) => {
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

            const response = await fetch("http://localhost:8080/recover-password/reset/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: recoveryEmail,
                    newPassword: data.newPassword,
                })
            });

            if (!response.ok) {
                // Manejar respuestas de error con o sin JSON
                let errorMessage = 'No se pudo cambiar la contraseña. Intenta nuevamente.';

                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                        console.error("Error al cambiar contraseña -> ", { errorData });
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
                        console.log("Contraseña cambiada exitosamente -> ", { responseData });
                    } catch (parseError) {
                        console.warn("No se pudo parsear la respuesta JSON, pero la contraseña se cambió correctamente");
                    }
                }
            }

            reset();

            // Limpiar el email del localStorage después de cambiar la contraseña exitosamente
            localStorage.removeItem('recovery_email');

            // Mostrar alerta de éxito
            await Swal.fire({
                title: "¡Contraseña Actualizada!",
                text: responseData?.message || 'Tu contraseña ha sido cambiada exitosamente.',
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            // Redirigir al login después de la alerta
            router.push('/login');

        } catch (error) {
            console.error("Error al cambiar contraseña:", error);

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

