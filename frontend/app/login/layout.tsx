import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your Finavex account to manage your finances professionally.",
    icons: {
        icon: "/login-user.png",
    },
}

export default function childrenLayout({children,}: { children: React.ReactNode }) {
    return <>{children}</>
}