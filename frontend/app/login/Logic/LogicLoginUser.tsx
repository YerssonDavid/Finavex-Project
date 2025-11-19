import { zodResolver } from '@hookform/resolvers/zod';
import {userLoginSchema, userLoginType} from "@/shemas/UserLogin";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/ContextUserData";

export const useFormLoginUser = () => {

    const context = useUser();

    const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<userLoginType> ({
        resolver: zodResolver(userLoginSchema),
    })

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    const { setUserData } = context;
    const router = useRouter();

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

            const resp = await response.json();

            // El backend envía: { data: { userId, email, name
            const nameUser = resp.data?.name ?? "";
            const emailUser = resp.data?.email ?? "";
            const userId = resp.data?.userId ?? null;

            const userObj = {
                nombre: nameUser,
                apellido: "",
                email: emailUser
            };

            setUserData(userObj);

            // Persistir en la misma clave que hidrata el Provider
            if (typeof window !== 'undefined') {
                localStorage.setItem('userData', JSON.stringify(userObj));
                // También guardar el userId por si lo necesitas después
                if (userId) {
                    localStorage.setItem('userId', String(userId));
                }
            }

            console.log("Inicio de sesión exitoso!");
            reset();

            router.push('/homePersonal');

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
