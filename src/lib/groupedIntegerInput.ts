import type { OptionalNumber } from "@/lib/numbers";

const FULLWIDTH_TO_ASCII = /[０-９]/g;
const MAX_ABS_DIGITS = 15;

function toAsciiDigits(raw: string): string {
  return raw.replace(FULLWIDTH_TO_ASCII, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10));
}

export function countNumericChars(value: string): number {
  let n = 0;
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") n += 1;
  }
  return n;
}

/** キャレットより左にある数字の個数（符号は数えない） */
export function digitCountBeforeCaret(value: string, caret: number): number {
  return countNumericChars(value.slice(0, Math.max(0, caret)));
}

/** 左から digitCount 個の数字の直後へキャレットを置く */
export function caretFromDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) {
    return formatted.startsWith("-") ? 1 : 0;
  }
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    const ch = formatted[i];
    if (ch >= "0" && ch <= "9") {
      seen += 1;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

export function formatGroupedInteger(value: OptionalNumber, grouped: boolean): string {
  if (value === "") return "";
  const n = Math.trunc(value);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const body = grouped ? abs.toLocaleString("en-US") : String(abs);
  return `${sign}${body}`;
}

export function parseGroupedIntegerInput(
  raw: string,
  allowNegative: boolean,
): { value: OptionalNumber; pendingMinus: boolean } {
  const s = toAsciiDigits(raw);
  const trimmedStart = s.trimStart();
  const digits = s.replace(/\D/g, "");

  if (allowNegative && trimmedStart.startsWith("-") && digits === "") {
    return { value: "", pendingMinus: true };
  }
  if (digits === "") return { value: "", pendingMinus: false };

  const clipped = digits.slice(0, MAX_ABS_DIGITS);
  const n = Number(clipped);
  if (!Number.isFinite(n)) return { value: "", pendingMinus: false };

  const negative = allowNegative && trimmedStart.startsWith("-");
  return { value: negative ? -Math.trunc(n) : Math.trunc(n), pendingMinus: false };
}
