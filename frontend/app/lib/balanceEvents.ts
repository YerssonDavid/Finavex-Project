// Sistema de eventos para actualizar el balance cuando se registra una transacción

type BalanceEventCallback = () => void

class BalanceEventEmitter {
  private listeners: BalanceEventCallback[] = []

  // Suscribirse al evento de actualización
  subscribe(callback: BalanceEventCallback): () => void {
    this.listeners.push(callback)
    // Retornar función para desuscribirse
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback)
    }
  }

  // Emitir evento para actualizar el balance
  emit(): void {
    this.listeners.forEach((callback) => callback())
  }
}

// Instancia singleton del emisor de eventos
export const balanceEvents = new BalanceEventEmitter()

