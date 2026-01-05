"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ThemeStyle = "masculine" | "feminine"

type ThemeContextType = {
  theme: Theme
  themeStyle: ThemeStyle
  setTheme: (theme: Theme) => void
  setThemeStyle: (style: ThemeStyle) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>("masculine")
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark", "masculine", "feminine")

    if (theme === "dark") {
      root.classList.add("dark")
    }

    if (themeStyle === "feminine") {
      root.classList.add("feminine")
    }
  }, [theme, themeStyle, mounted])

  return (
    <ThemeContext.Provider value={{ theme, themeStyle, setTheme, setThemeStyle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
