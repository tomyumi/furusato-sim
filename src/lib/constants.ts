/** 令和7年分（2025年）目安の税制定数 */

export const INCOME_TAX_BRACKETS = [
  { upTo: 1_950_000, rate: 0.05, deduction: 0 },
  { upTo: 3_300_000, rate: 0.1, deduction: 97_500 },
  { upTo: 6_950_000, rate: 0.2, deduction: 427_500 },
  { upTo: 9_000_000, rate: 0.23, deduction: 636_000 },
  { upTo: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { upTo: 40_000_000, rate: 0.4, deduction: 2_796_000 },
  { upTo: Infinity, rate: 0.45, deduction: 4_796_000 },
] as const;

export const RECONSTRUCTION_SURTAX = 0.021;
export const RESIDENT_TAX_RATE = 0.1;
export const FURUSATO_SPECIAL_CAP_RATIO = 0.2;
export const SELF_BURDEN = 2_000;

export function basicDeductionIncomeTax(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

export function basicDeductionResidentTax(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 430_000;
  if (totalIncome <= 24_500_000) return 290_000;
  if (totalIncome <= 25_000_000) return 150_000;
  return 0;
}

export function spouseDeductionIncomeTax(
  totalIncome: number,
  spouseIncome: number,
): number {
  if (spouseIncome > 480_000) return 0;
  if (totalIncome <= 9_000_000) return 380_000;
  if (totalIncome <= 9_500_000) return 260_000;
  if (totalIncome <= 10_000_000) return 130_000;
  return 0;
}

export function spouseSpecialDeductionIncomeTax(
  totalIncome: number,
  spouseIncome: number,
): number {
  if (spouseIncome <= 480_000 || spouseIncome > 1_330_000) return 0;
  if (totalIncome > 10_000_000) return 0;

  let base = 0;
  if (spouseIncome <= 950_000) base = 380_000;
  else if (spouseIncome <= 1_000_000) base = 360_000;
  else if (spouseIncome <= 1_050_000) base = 310_000;
  else if (spouseIncome <= 1_100_000) base = 260_000;
  else if (spouseIncome <= 1_150_000) base = 210_000;
  else if (spouseIncome <= 1_200_000) base = 160_000;
  else if (spouseIncome <= 1_250_000) base = 110_000;
  else if (spouseIncome <= 1_300_000) base = 60_000;
  else base = 30_000;

  if (totalIncome <= 9_000_000) return base;
  if (totalIncome <= 9_500_000) return Math.floor(base * (26 / 38));
  if (totalIncome <= 10_000_000) return Math.floor(base * (13 / 38));
  return 0;
}

export function spouseDeductionResidentTax(
  totalIncome: number,
  spouseIncome: number,
): number {
  if (spouseIncome > 480_000) return 0;
  if (totalIncome <= 9_000_000) return 330_000;
  if (totalIncome <= 9_500_000) return 220_000;
  if (totalIncome <= 10_000_000) return 110_000;
  return 0;
}

export function spouseSpecialDeductionResidentTax(
  totalIncome: number,
  spouseIncome: number,
): number {
  if (spouseIncome <= 480_000 || spouseIncome > 1_330_000) return 0;
  if (totalIncome > 10_000_000) return 0;

  let base = 0;
  if (spouseIncome <= 950_000) base = 330_000;
  else if (spouseIncome <= 1_000_000) base = 330_000;
  else if (spouseIncome <= 1_050_000) base = 310_000;
  else if (spouseIncome <= 1_100_000) base = 260_000;
  else if (spouseIncome <= 1_150_000) base = 210_000;
  else if (spouseIncome <= 1_200_000) base = 160_000;
  else if (spouseIncome <= 1_250_000) base = 110_000;
  else if (spouseIncome <= 1_300_000) base = 60_000;
  else base = 30_000;

  if (totalIncome <= 9_000_000) return base;
  if (totalIncome <= 9_500_000) return Math.floor(base * (22 / 33));
  if (totalIncome <= 10_000_000) return Math.floor(base * (11 / 33));
  return 0;
}

export const DEPENDENT_DEDUCTION_INCOME_TAX = {
  general: 380_000,
  specific: 630_000,
  elderly: 480_000,
  elderlyLiving: 580_000,
} as const;

export const DEPENDENT_DEDUCTION_RESIDENT_TAX = {
  general: 330_000,
  specific: 450_000,
  elderly: 380_000,
  elderlyLiving: 450_000,
} as const;

export const LIFE_INSURANCE_CAP = 120_000;
export const EARTHQUAKE_INSURANCE_CAP = 50_000;
