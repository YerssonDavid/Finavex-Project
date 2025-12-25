"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsModalProps {
  news: {
    id: number
    title: string
    description: string
    content: string
    icon: any
    color: string
    time: string
  }
  onClose: () => void
}

export function NewsModal({ news, onClose }: NewsModalProps) {
  const Icon = news.icon

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-2xl border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-white/10 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${news.color} flex items-center justify-center animate-in zoom-in duration-700`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-balance mb-2 animate-in slide-in-from-left duration-500">
                {news.title}
              </h2>
              <p
                className="text-sm text-muted-foreground animate-in slide-in-from-left duration-500"
                style={{ animationDelay: "100ms" }}
              >
                {news.time}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-lg text-muted-foreground text-pretty animate-in slide-in-from-bottom duration-500"
            style={{ animationDelay: "200ms" }}
          >
            {news.description}
          </p>

          {/* Full content */}
          <div
            className="pt-4 border-t border-border/50 animate-in slide-in-from-bottom duration-500"
            style={{ animationDelay: "300ms" }}
          >
            <p className="text-foreground leading-relaxed text-pretty">{news.content}</p>
          </div>

          {/* Action buttons */}
          <div
            className="flex gap-3 pt-4 animate-in slide-in-from-bottom duration-500"
            style={{ animationDelay: "400ms" }}
          >
            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Leer más
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10 bg-transparent"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
