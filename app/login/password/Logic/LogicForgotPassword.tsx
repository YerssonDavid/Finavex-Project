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

            if(response.status === 200){
                try{
                    const sendEmailCode = await fetch("http://localhost:8080/code-recovery/send", {
                        method: "POST",
                        headers: {
                            "Content-type":"application/json"
                        },
                        body: JSON.stringify({
                          email:data.email,
                        })
                    });

                    if(!sendEmailCode.ok){
                        console.log("Error al enviar el email de recuperación");
                        await Swal.fire({
                            title: "Error",
                            text: 'No se pudo enviar el código de recuperación.',
                            icon: "error",
                            confirmButtonText: "Aceptar"
                        });
                        return;
                    }

                    // Verificar si la respuesta tiene contenido antes de parsear JSON
                    let sendEmailCodeResponse;
                    const contentType = sendEmailCode.headers.get("content-type");

                    if (contentType && contentType.includes("application/json")) {
                        const responseText = await sendEmailCode.text();
                        if (responseText && responseText.trim().length > 0) {
                            sendEmailCodeResponse = JSON.parse(responseText);
                        } else {
                            sendEmailCodeResponse = { message: 'Código enviado exitosamente' };
                        }
                    } else {
                        sendEmailCodeResponse = { message: 'Código enviado exitosamente' };
                    }

                    console.log("Enviado exitoso!", sendEmailCodeResponse);

                    // Si la respuesta es OK, mostrar éxito y redirigir a changePassword
                    reset();
                    await Swal.fire({
                        title: "¡Éxito!",
                        text: sendEmailCodeResponse.message || 'Se ha enviado un código de recuperación a tu email.',
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    });

                    // Redirigir a la página de cambio de contraseña
                    router.push('/login/password/changePassword');
                    return;

                } catch(sendEmailError){
                    console.error("Error al enviar el email de recuperación -> ", {sendEmailError} );
                    await Swal.fire({
                        title: "Error",
                        text: 'Ocurrió un error al enviar el código de recuperación.',
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            }

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

