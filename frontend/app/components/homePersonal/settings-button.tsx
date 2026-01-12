"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

interface SettingsButtonProps {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed top-6 right-6 z-50 h-12 w-12 rounded-xl glass-strong border border-white/20 shadow-2xl hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-top cursor-pointer"
    >
      <Settings className="h-5 w-5 text-foreground animate-spin-slow" style={{ animationDuration: "8s" }} />
    </Button>
  )
}
