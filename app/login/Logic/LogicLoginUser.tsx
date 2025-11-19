import { zodResolver } from '@hookform/resolvers/zod';
import {userLoginSchema, userLoginType} from "@/shemas/UserLogin";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export const useFormLoginUser = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<userLoginType> ({
        resolver: zodResolver(userLoginSchema),
    })

    const onSubmit = async (data : userLoginType) => {
        try {
            const response = await fetch("http://localhost:8080/Users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error("Error en el inicio de sesión! -> ", {errorData});
                throw new Error(errorData.message || 'Error desconocido del servidor');
            }

            const responseData = await response.json();
            console.log(responseData);
            reset();


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
