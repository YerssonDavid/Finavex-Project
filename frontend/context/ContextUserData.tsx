'use client'

import {createContext, useContext, useState, ReactNode, useEffect} from "react";

interface propsDataUser {
    nombre: string;
    apellido: string;
    email: string;
}

interface UserContextType {
    userData: propsDataUser | null;
    setUserData: (data: propsDataUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Estado inicial nulo; se hidrata en el cliente con useEffect
    const [userData, setUserData] = useState<propsDataUser | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('userData');
            if (saved) {
                try {
                    setUserData(JSON.parse(saved));
                } catch (_err) {
                    // Si hay datos corruptos, limpiamos
                    localStorage.removeItem('userData');
                }
            }
        }
    }, []);

    const saveUserData = (data: propsDataUser | null) => {
        setUserData(data);
        // Guarda también en localStorage
        if (typeof window !== 'undefined') {
            if (data) {
                localStorage.setItem('userData', JSON.stringify(data));
            } else {
                localStorage.removeItem('userData');
            }
        }
    };

    return (
        <UserContext.Provider value={{ userData, setUserData: saveUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}