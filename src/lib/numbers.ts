/** 未入力は空文字。計算時は 0 として扱う */
export type OptionalNumber = number | "";

export function toAmount(value: OptionalNumber | number | undefined | null): number {
  if (value === "" || value === undefined || value === null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
