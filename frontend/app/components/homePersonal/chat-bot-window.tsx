"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatBotWindowProps {
  isOpen: boolean
  onClose: () => void
}

// Función para formatear el contenido del mensaje
function formatBotMessage(content: string): JSX.Element[] {
  // Reemplazar fórmulas LaTeX con formato legible
  let formattedContent = content
    // Convertir fracciones \frac{a}{b} a a/b
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    // Convertir exponentes ^{...} a formato legible
    .replace(/\^\{([^}]+)\}/g, '^($1)')
    // Convertir subíndices _{...}
    .replace(/_\{([^}]+)\}/g, '₍$1₎')
    // Convertir \left( y \right) a paréntesis normales
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    // Convertir \times a ×
    .replace(/\\times/g, '×')
    // Convertir \approx a ≈
    .replace(/\\approx/g, '≈')
    // Convertir \text{...} a texto normal
    .replace(/\\text\{([^}]+)\}/g, '$1')
    // Eliminar \[ y \] (display math)
    .replace(/\\\[/g, '\n📐 ')
    .replace(/\\\]/g, '\n')
    // Eliminar $ (inline math)
    .replace(/\$/g, '')
    // Limpiar espacios múltiples
    .replace(/\s+/g, ' ')
    .trim()

  // Dividir por saltos de línea y crear elementos
  const lines = formattedContent.split('\n').filter(line => line.trim())

  return lines.map((line, index) => {
    const trimmedLine = line.trim()

    // Si es una fórmula (empieza con 📐)
    if (trimmedLine.startsWith('📐')) {
      return (
        <div
          key={index}
          className="my-2 p-2 bg-primary/10 rounded-lg font-mono text-xs border-l-2 border-primary"
        >
          {trimmedLine}
        </div>
      )
    }

    // Texto normal
    return (
      <p key={index} className="mb-1 last:mb-0">
        {trimmedLine}
      </p>
    )
  })
}

export function ChatBotWindow({ isOpen, onClose }: ChatBotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/AI/chat/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      })

      if (!response.ok) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      const data = await response.json()
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response || data.answer || data.content || data.message || data.result || (typeof data === "string" ? data : JSON.stringify(data)),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error al enviar el mensaje:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <Card
      className={`
        fixed bottom-24 right-6 z-50
        w-80 sm:w-96 h-[500px]
        flex flex-col
        bg-card/95 backdrop-blur-xl
        border border-border/50
        shadow-2xl shadow-primary/20
        rounded-2xl overflow-hidden
        animate-in slide-in-from-bottom-5 fade-in duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Asistente Finavex</h3>
            <p className="text-xs text-muted-foreground">Siempre disponible</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">¡Hola! Soy tu asistente</h4>
            <p className="text-sm text-muted-foreground">
              ¿En qué puedo ayudarte hoy?
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.role === "user"
                  ? "bg-gradient-to-br from-accent to-accent/70"
                  : "bg-gradient-to-br from-primary via-secondary to-accent"
                }
              `}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-accent-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
            <div
              className={`
                max-w-[75%] p-3 rounded-2xl
                ${message.role === "user"
                  ? "bg-accent text-accent-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
                }
              `}
            >
              <div className="text-sm leading-relaxed">
                {message.role === "bot"
                  ? formatBotMessage(message.content)
                  : <p>{message.content}</p>
                }
              </div>
              <p className="text-[10px] opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className={`
              flex-1 px-4 py-2.5 rounded-xl
              bg-muted/50 border border-border/50
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200
              disabled:opacity-50
            `}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className={`
              h-10 w-10 rounded-xl
              bg-gradient-to-br from-primary to-secondary
              hover:from-primary/90 hover:to-secondary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

