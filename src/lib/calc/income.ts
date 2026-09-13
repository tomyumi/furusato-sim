export function calcSalaryIncomeDeduction(revenue: number): number {
  if (revenue <= 0) return 0;
  if (revenue <= 1_625_000) return Math.min(550_000, revenue);
  if (revenue <= 1_800_000) return revenue * 0.4 - 100_000;
  if (revenue <= 3_600_000) return revenue * 0.3 + 80_000;
  if (revenue <= 6_600_000) return revenue * 0.2 + 440_000;
  if (revenue <= 8_500_000) return revenue * 0.1 + 1_100_000;
  return 1_950_000;
}

export function calcSalaryIncome(revenue: number): number {
  if (revenue <= 0) return 0;
  return Math.max(0, Math.floor(revenue - calcSalaryIncomeDeduction(revenue)));
}

export function calcBusinessIncome(
  revenue: number,
  expenses: number,
  blueSpecialDeduction: number,
): number {
  const beforeBlue = revenue - expenses;
  if (beforeBlue <= 0) return beforeBlue;
  return beforeBlue - Math.min(blueSpecialDeduction, beforeBlue);
}
