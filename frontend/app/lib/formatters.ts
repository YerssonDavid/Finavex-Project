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

/**
 * Cleans an amount input string by removing everything except digits and a single comma.
 * Replaces the comma with a dot for internal decimal representation.
 * Validates that there's at most one decimal point and maximum 2 decimal places.
 */
export function cleanAmountInput(value: string): string | null {
  // Remove everything except numbers and comma (for decimals)
  let cleaned = value.replace(/[^\d,]/g, "")

  // Replace comma with dot to process internally
  cleaned = cleaned.replace(",", ".")

  // Validate format: only one decimal point and maximum 2 decimals
  const parts = cleaned.split(".")
  if (parts.length > 2) return null // Don't allow more than one point
  if (parts[1] && parts[1].length > 2) return null // Max 2 decimals

  return cleaned
}

/**
 * Formats a decimal string (using dot as separator) with thousand separators (dots)
 * and decimal separator (comma).
 */
export function formatAmountWithThousands(value: string): string {
  if (!value) return ""

  // Separate integer and decimal parts
  const parts = value.split(".")
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Add dots as thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Reconstruct the number with comma for decimals
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`
  }
  return formattedInteger
}
