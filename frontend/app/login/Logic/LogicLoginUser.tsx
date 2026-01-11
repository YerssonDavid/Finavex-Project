import { zodResolver } from '@hookform/resolvers/zod';
import {userLoginSchema, userLoginType} from "@/shemas/UserLogin";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/ContextUserData";
import { useState, useEffect } from 'react';

// Constantes para el bloqueo
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos en milisegundos
const LOGIN_ATTEMPTS_KEY = 'loginAttempts';
const LOGIN_BLOCK_TIME_KEY = 'loginBlockTime';

export const useFormLoginUser = () => {

    const context = useUser();
    const [isAccountLocked, setIsAccountLocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<userLoginType> ({
        resolver: zodResolver(userLoginSchema),
    })

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    const { setUserData } = context;
    const router = useRouter();

    // Verificar si la cuenta está bloqueada al montar el componente
    useEffect(() => {
        checkAccountLockStatus();

        // Configurar intervalo para actualizar el tiempo restante
        const interval = setInterval(() => {
            checkAccountLockStatus();
        }, 1000); // Actualizar cada segundo

        return () => clearInterval(interval);
    }, []);

    // Función para verificar el estado del bloqueo
    const checkAccountLockStatus = (): void => {
        if (typeof window === 'undefined') return;

        const blockTime = localStorage.getItem(LOGIN_BLOCK_TIME_KEY);

        if (blockTime) {
            const blockTimestamp = parseInt(blockTime);
            const now = Date.now();
            const timePassed = now - blockTimestamp;

            if (timePassed < BLOCK_DURATION_MS) {
                const timeRemaining = Math.ceil((BLOCK_DURATION_MS - timePassed) / 1000);
                setIsAccountLocked(true);
                setRemainingTime(timeRemaining);
            } else {
                // El bloqueo ha expirado, limpiar datos
                localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
                localStorage.removeItem(LOGIN_BLOCK_TIME_KEY);
                setIsAccountLocked(false);
                setRemainingTime(0);
            }
        } else {
            setIsAccountLocked(false);
            setRemainingTime(0);
        }
    };

    // Función para registrar un intento fallido
    const recordFailedAttempt = (): { isLocked: boolean; attempts: number; attemptsRemaining?: number; message: string } => {
        if (typeof window === 'undefined') {
            return {
                isLocked: false,
                attempts: 0,
                message: 'No disponible en SSR'
            };
        }

        let attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '0');
        attempts++;

        localStorage.setItem(LOGIN_ATTEMPTS_KEY, String(attempts));

        if (attempts >= MAX_ATTEMPTS) {
            // Bloquear la cuenta
            localStorage.setItem(LOGIN_BLOCK_TIME_KEY, String(Date.now()));
            setIsAccountLocked(true);
            setRemainingTime(Math.ceil(BLOCK_DURATION_MS / 1000));

            return {
                isLocked: true,
                attempts: attempts,
                message: `Cuenta bloqueada por seguridad. Intenta nuevamente en 30 minutos.`
            };
        }

        return {
            isLocked: false,
            attempts: attempts,
            attemptsRemaining: MAX_ATTEMPTS - attempts,
            message: `Intento fallido. ${MAX_ATTEMPTS - attempts} intento${MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} restante${MAX_ATTEMPTS - attempts !== 1 ? 's' : ''}.`
        };
    };

    // Función para limpiar intentos (login exitoso)
    const clearAttempts = (): void => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
        localStorage.removeItem(LOGIN_BLOCK_TIME_KEY);
        setIsAccountLocked(false);
        setRemainingTime(0);
    };

    // Función auxiliar para convertir segundos a formato MM:SS
    const formatTimeRemaining = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const onSubmit = async (data : userLoginType) => {
        try {
            // Verificar si la cuenta está bloqueada
            if (isAccountLocked) {
                await Swal.fire({
                    title: "Cuenta Bloqueada",
                    text: `Tu cuenta ha sido bloqueada por seguridad. Intenta nuevamente en ${formatTimeRemaining(remainingTime)}.`,
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

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

                // ✅ MANEJO ESPECIAL: Status 423 LOCKED del backend
                if(response.status === 423) {
                    // La cuenta está bloqueada en el backend
                    // Bloquear automáticamente en el frontend
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(LOGIN_BLOCK_TIME_KEY, String(Date.now()));
                        localStorage.setItem(LOGIN_ATTEMPTS_KEY, String(MAX_ATTEMPTS));
                    }
                    setIsAccountLocked(true);
                    setRemainingTime(Math.ceil(BLOCK_DURATION_MS / 1000));

                    await Swal.fire({
                        title: "Cuenta Bloqueada por el Servidor",
                        text: `${errorData.message || 'Tu cuenta ha sido bloqueada. Intenta nuevamente en 3 minutos.'}`,
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                    return;
                }

                // Registrar intento fallido (para 401, 403, 5xx, etc.)
                const attemptResult = recordFailedAttempt();

                // Mostrar alerta con información de intentos
                await Swal.fire({
                    title: "Error de Inicio de Sesión",
                    text: attemptResult.isLocked
                        ? attemptResult.message
                        : `${errorData.message || 'Email o contraseña incorrectos'}\n\n${attemptResult.message}`,
                    icon: attemptResult.isLocked ? "error" : "warning",
                    confirmButtonText: "Aceptar"
                });

                // Si la cuenta se bloqueó, actualizar estado
                if (attemptResult.isLocked) {
                    setIsAccountLocked(true);
                    setRemainingTime(Math.ceil(BLOCK_DURATION_MS / 1000));
                }

                return;
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

            // Limpiar intentos fallidos tras login exitoso
            clearAttempts();

            console.log("Inicio de sesión exitoso!");
            reset();

            document.cookie = 'isAuthenticated=true; path=/; max-age=86400'; // 24 horas
            router.push('/homePersonal');

        } catch (error){
            console.error("El error -> ", {error});

            if(String(error) === "TypeError: Failed to fetch"){
                await Swal.fire({
                    title: "Error",
                    text: 'Ups, tenemos problemas galacticos. Intenta en un rato!',
                    icon: "error",
                    timer: 3000
                });
                return;
            }

            // Registrar intento fallido por error inesperado
            const attemptResult = recordFailedAttempt();

            await Swal.fire({
                title: "Error",
                text: (error as Error).message || String(error),
                icon: "error",
                timer: 3000
            });

            // Si la cuenta se bloqueó, actualizar estado
            if (attemptResult.isLocked) {
                setIsAccountLocked(true);
                setRemainingTime(Math.ceil(BLOCK_DURATION_MS / 1000));
            }
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        reset,
        isAccountLocked,
        remainingTime
    };
};
