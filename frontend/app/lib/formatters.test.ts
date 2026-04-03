import { describe, expect, it } from "bun:test"
import { formatCopInput } from "./formatters"

describe("formatCopInput", () => {
  it("should format a numeric string with thousand separators", () => {
    expect(formatCopInput("123456")).toBe("123.456")
  })

  it("should strip non-numeric characters before formatting", () => {
    expect(formatCopInput("$1.234,56")).toBe("123.456")
    expect(formatCopInput("abc123def456")).toBe("123.456")
  })

  it("should return an empty string for empty input", () => {
    expect(formatCopInput("")).toBe("")
  })

  it("should return an empty string for input with no digits", () => {
    expect(formatCopInput("abc!@#")).toBe("")
  })

  it("should format large numbers correctly", () => {
    expect(formatCopInput("1000000")).toBe("1.000.000")
  })

  it("should handle single digit input", () => {
    expect(formatCopInput("5")).toBe("5")
  })

  it("should handle zero", () => {
    expect(formatCopInput("0")).toBe("0")
  })
})
