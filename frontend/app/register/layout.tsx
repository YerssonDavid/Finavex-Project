import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Register - Finavex",
    description: "Create your account on Finavex, the free professional financial management platform.",
    icons: {
        icon: "/register-user.png",
    },
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
