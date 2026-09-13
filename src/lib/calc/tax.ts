import {
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_SURTAX,
  RESIDENT_TAX_RATE,
} from "@/lib/constants";

export function getMarginalIncomeTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= b.upTo) return b.rate;
  }
  return 0.45;
}

export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const bracket =
    INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upTo) ??
    INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  return Math.floor(taxableIncome * bracket.rate - bracket.deduction);
}

export function calcIncomeTaxWithSurtax(taxableIncome: number): number {
  return Math.floor(calcIncomeTax(taxableIncome) * (1 + RECONSTRUCTION_SURTAX));
}

export function calcAdjustmentDeduction(humanDeductionDiff: number): number {
  const diff = Math.max(0, humanDeductionDiff);
  if (diff === 0) return 0;
  return Math.floor(diff * 0.05);
}

export function calcResidentTaxIncomeLevy(
  taxableIncome: number,
  adjustmentDeduction: number,
  housingLoanResidentCredit: number,
): number {
  if (taxableIncome <= 0) return 0;
  const raw = Math.floor(taxableIncome * RESIDENT_TAX_RATE);
  return Math.max(0, raw - adjustmentDeduction - housingLoanResidentCredit);
}
