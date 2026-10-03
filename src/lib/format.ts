import { toAmount, type OptionalNumber } from "@/lib/numbers";

export function formatYen(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${Math.abs(Math.round(amount)).toLocaleString("ja-JP")}円`;
}

/** 0.1 → 10%、0.7979 → 79.79% */
export function formatPercent(rate: number): string {
  const pct = Math.round(rate * 10000) / 100;
  return `${Number(pct.toFixed(2))}%`;
}

export function formatInputAmount(value: OptionalNumber): string {
  if (value === "") return "未入力（0円として計算）";
  return formatYen(toAmount(value));
}

export function formatInputYear(value: OptionalNumber): string {
  if (value === "") return "未入力";
  return `${toAmount(value)}年`;
}

export function formatInputCount(value: OptionalNumber): string {
  if (value === "") return "未入力（0人として計算）";
  return `${toAmount(value)}人`;
}
