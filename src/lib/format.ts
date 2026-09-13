export function formatYen(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${Math.abs(Math.round(amount)).toLocaleString("ja-JP")}円`;
}

/** 0.1 → 10%、0.7979 → 79.79% */
export function formatPercent(rate: number): string {
  const pct = Math.round(rate * 10000) / 100;
  return `${Number(pct.toFixed(2))}%`;
}
