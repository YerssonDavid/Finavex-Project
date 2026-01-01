"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatBotButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatBotButton({ onClick, isOpen }: ChatBotButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-br from-primary via-secondary to-accent
        hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90
        text-primary-foreground font-bold text-xs
        shadow-lg shadow-primary/30
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl hover:shadow-primary/40
        ${isOpen ? 'rotate-180' : 'rotate-0'}
      `}
      size="icon"
    >
      {isOpen ? (
        <span className="text-lg font-bold">×</span>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">BOT</span>
        </div>
      )}
    </Button>
  )
}

