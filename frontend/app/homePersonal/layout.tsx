import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Finavex - Panel Personal',
  description: 'Tu centro financiero personal',
}

export default function HomePersonalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
