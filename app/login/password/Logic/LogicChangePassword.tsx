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
     * NOTA: Debes ajustar la URL y el body según tu API del backend
     *
     * Ejemplo de estructura que podrías enviar:
     * {
     *   "newPassword": "NuevaContraseña123!",
     *   "token": "token-de-recuperacion" // Si usas tokens
     * }
     */
    const onSubmit = async (data: changePasswordType) => {
        try {

            const response = await fetch("http://localhost:8080/Users/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newPassword: data.newPassword,
                    // token: token, // Descomenta si usas tokens de recuperación
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Error al cambiar la contraseña'
                }));

                await Swal.fire({
                    title: "Error",
                    text: errorData.message || 'No se pudo cambiar la contraseña. Intenta nuevamente.',
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            const result = await response.json();
            console.log("Contraseña cambiada exitosamente:", result);
            reset();

            // Mostrar alerta de éxito
            await Swal.fire({
                title: "¡Contraseña Actualizada!",
                text: result.message || 'Tu contraseña ha sido cambiada exitosamente.',
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

