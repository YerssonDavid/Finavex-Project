import { expect, test, describe } from "bun:test";
import { cleanAmountInput, formatAmountWithThousands } from "./formatters";

describe("formatters", () => {
  describe("cleanAmountInput", () => {
    test("should remove everything except digits and comma", () => {
      expect(cleanAmountInput("1.234,56")).toBe("1234.56");
      expect(cleanAmountInput("$ 1.234,56")).toBe("1234.56");
      expect(cleanAmountInput("abc12,34def")).toBe("12.34");
    });

    test("should replace comma with dot", () => {
      expect(cleanAmountInput("12,34")).toBe("12.34");
    });

    test("should handle multiple dots/commas correctly", () => {
      // current implementation: replace(/[^\d,]/g, "") then replace(",", ".")
      // "1,2,3" -> "1.2,3" (only first comma replaced if using .replace(",", "."))
      // Let's check my implementation: cleaned = cleaned.replace(",", ".")
      // String.replace(string, string) only replaces the first occurrence.
      expect(cleanAmountInput("1,2,3")).toBeNull(); // parts.length > 2
    });

    test("should return null for more than one decimal point", () => {
      expect(cleanAmountInput("12,34,56")).toBeNull();
    });

    test("should return null for more than 2 decimal places", () => {
      expect(cleanAmountInput("12,345")).toBeNull();
    });

    test("should handle empty input", () => {
      expect(cleanAmountInput("")).toBe("");
    });
  });

  describe("formatAmountWithThousands", () => {
    test("should format with dots for thousands and comma for decimals", () => {
      expect(formatAmountWithThousands("1234.56")).toBe("1.234,56");
      expect(formatAmountWithThousands("1234567.89")).toBe("1.234.567,89");
    });

    test("should handle integer only", () => {
      expect(formatAmountWithThousands("1234")).toBe("1.234");
    });

    test("should handle empty input", () => {
      expect(formatAmountWithThousands("")).toBe("");
    });
  });
});
