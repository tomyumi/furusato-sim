import {
  DEPENDENT_DEDUCTION_INCOME_TAX,
  DEPENDENT_DEDUCTION_RESIDENT_TAX,
  EARTHQUAKE_INSURANCE_CAP,
  LIFE_INSURANCE_CAP,
  basicDeductionIncomeTax,
  basicDeductionResidentTax,
  spouseDeductionIncomeTax,
  spouseDeductionResidentTax,
  spouseSpecialDeductionIncomeTax,
  spouseSpecialDeductionResidentTax,
} from "@/lib/constants";
import type { BreakdownLine, NumericDeductionInput, NumericFamilyInput } from "@/lib/types";
import { formatInteger } from "@/lib/format";

export interface PersonalDeductions {
  lines: BreakdownLine[];
  total: number;
}

function clamp(n: number, max: number): number {
  return Math.max(0, Math.min(n, max));
}

export function calcIncomeTaxDeductions(
  totalIncome: number,
  deductions: NumericDeductionInput,
  family: NumericFamilyInput,
): PersonalDeductions {
  const lines: BreakdownLine[] = [];

  const social = Math.max(0, Math.floor(deductions.socialInsurance));
  lines.push({ label: "社会保険料控除", amount: social });

  const life = clamp(Math.floor(deductions.lifeInsurance), LIFE_INSURANCE_CAP);
  lines.push({
    label: "生命保険料控除",
    amount: life,
    note: `上限 ${formatInteger(LIFE_INSURANCE_CAP)}円`,
  });

  const quake = clamp(
    Math.floor(deductions.earthquakeInsurance),
    EARTHQUAKE_INSURANCE_CAP,
  );
  lines.push({
    label: "地震保険料控除",
    amount: quake,
    note: `上限 ${formatInteger(EARTHQUAKE_INSURANCE_CAP)}円`,
  });

  const ideco = Math.max(0, Math.floor(deductions.ideco));
  lines.push({ label: "小規模企業共済等掛金控除（iDeCo等）", amount: ideco });

  const medical = Math.max(0, Math.floor(deductions.medicalExpense));
  lines.push({
    label: "医療費控除",
    amount: medical,
    note: "入力値をそのまま使用（自己負担額の計算は別途）",
  });

  if (family.spouseStatus === "deduction") {
    lines.push({
      label: "配偶者控除",
      amount: spouseDeductionIncomeTax(totalIncome, family.spouseIncome),
    });
  } else if (family.spouseStatus === "special") {
    lines.push({
      label: "配偶者特別控除",
      amount: spouseSpecialDeductionIncomeTax(totalIncome, family.spouseIncome),
    });
  }

  const dep =
    family.dependentGeneral * DEPENDENT_DEDUCTION_INCOME_TAX.general +
    family.dependentSpecific * DEPENDENT_DEDUCTION_INCOME_TAX.specific +
    family.dependentElderly * DEPENDENT_DEDUCTION_INCOME_TAX.elderly +
    family.dependentElderlyLiving * DEPENDENT_DEDUCTION_INCOME_TAX.elderlyLiving;
  if (dep > 0) {
    lines.push({ label: "扶養控除", amount: dep });
  }

  lines.push({ label: "基礎控除", amount: basicDeductionIncomeTax(totalIncome) });

  return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
}

export function calcResidentTaxDeductions(
  totalIncome: number,
  deductions: NumericDeductionInput,
  family: NumericFamilyInput,
): PersonalDeductions {
  const lines: BreakdownLine[] = [];

  lines.push({
    label: "社会保険料控除",
    amount: Math.max(0, Math.floor(deductions.socialInsurance)),
  });
  lines.push({
    label: "生命保険料控除（住民税）",
    amount: clamp(Math.floor(deductions.lifeInsurance), 70_000),
  });
  lines.push({
    label: "地震保険料控除（住民税）",
    amount: clamp(Math.floor(deductions.earthquakeInsurance), 25_000),
  });
  lines.push({
    label: "小規模企業共済等掛金控除（iDeCo等）",
    amount: Math.max(0, Math.floor(deductions.ideco)),
  });
  lines.push({
    label: "医療費控除",
    amount: Math.max(0, Math.floor(deductions.medicalExpense)),
  });

  if (family.spouseStatus === "deduction") {
    lines.push({
      label: "配偶者控除",
      amount: spouseDeductionResidentTax(totalIncome, family.spouseIncome),
    });
  } else if (family.spouseStatus === "special") {
    lines.push({
      label: "配偶者特別控除",
      amount: spouseSpecialDeductionResidentTax(totalIncome, family.spouseIncome),
    });
  }

  const dep =
    family.dependentGeneral * DEPENDENT_DEDUCTION_RESIDENT_TAX.general +
    family.dependentSpecific * DEPENDENT_DEDUCTION_RESIDENT_TAX.specific +
    family.dependentElderly * DEPENDENT_DEDUCTION_RESIDENT_TAX.elderly +
    family.dependentElderlyLiving * DEPENDENT_DEDUCTION_RESIDENT_TAX.elderlyLiving;
  if (dep > 0) {
    lines.push({ label: "扶養控除", amount: dep });
  }

  lines.push({
    label: "基礎控除",
    amount: basicDeductionResidentTax(totalIncome),
  });

  return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
}
