export function formatCurrencyCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCopInput(rawValue: string): string {
  const digitsOnly = rawValue.replace(/\D/g, "")
  if (!digitsOnly) return ""

  return new Intl.NumberFormat("es-CO").format(Number(digitsOnly))
}

export function parseCopInput(value: string): number {
  const digitsOnly = value.replace(/\D/g, "")
  if (!digitsOnly) return 0

  return Number(digitsOnly)
}

export function formatDateLocal(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ""

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

