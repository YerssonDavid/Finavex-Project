import type React from "react"
import type {Metadata} from "next"
import {GeistSans} from "geist/font/sans"
import {GeistMono} from "geist/font/mono"
import {Analytics} from "@vercel/analytics/next"
import {Suspense} from "react"
import "./globals.css"
import {UserProvider} from "../context/ContextUserData";

export const metadata: Metadata = {
    title: "Finavex - Transforma tu Futuro Financiero",
    description:
        "Tu aliado inteligente para gestionar tus finanzas de manera profesional, completamente gratuita y con la seguridad que mereces.",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="dark" suppressHydrationWarning>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
                <UserProvider>
                    <Suspense fallback={null}>
                        {children}
                    </Suspense>
                    <Analytics/>
                </UserProvider>
            </body>
        </html>
    );
}
