/** ふるさと納税シミュレーター用の入力・計算型定義 */

import { toAmount, type OptionalNumber } from "@/lib/numbers";

export type { OptionalNumber };

export type BlueSpecialDeduction = 0 | 100000 | 550000 | 650000;

export type SpouseStatus = "none" | "deduction" | "special";

/** ユーザーが手で選ぶ住宅ローン控除率。空は未選択。値は era ルールから増減する。 */
export type HousingLoanRateChoice = number | "";

export interface IncomeInput {
  primarySalaryRevenue: OptionalNumber;
  sideSalaryRevenue: OptionalNumber;
  businessRevenue: OptionalNumber;
  businessExpenses: OptionalNumber;
  blueSpecialDeduction: BlueSpecialDeduction | "";
  otherIncome: OptionalNumber;
}

export interface DeductionInput {
  socialInsurance: OptionalNumber;
  lifeInsurance: OptionalNumber;
  earthquakeInsurance: OptionalNumber;
  ideco: OptionalNumber;
  medicalExpense: OptionalNumber;
}

export interface FamilyInput {
  spouseStatus: SpouseStatus;
  spouseIncome: OptionalNumber;
  dependentGeneral: OptionalNumber;
  dependentSpecific: OptionalNumber;
  dependentElderly: OptionalNumber;
  dependentElderlyLiving: OptionalNumber;
  hasHousingLoanCredit: boolean;
  occupancyYear: OptionalNumber;
  housingLoanRate: HousingLoanRateChoice;
  housingLoanYearEndBalance: OptionalNumber;
  housingLoanPossibleAmount: OptionalNumber;
}

export interface SimulatorFormState {
  taxYear: OptionalNumber;
  income: IncomeInput;
  deductions: DeductionInput;
  family: FamilyInput;
}

export interface NumericIncomeInput {
  primarySalaryRevenue: number;
  sideSalaryRevenue: number;
  businessRevenue: number;
  businessExpenses: number;
  blueSpecialDeduction: number;
  otherIncome: number;
}

export interface NumericDeductionInput {
  socialInsurance: number;
  lifeInsurance: number;
  earthquakeInsurance: number;
  ideco: number;
  medicalExpense: number;
}

export interface NumericFamilyInput {
  spouseStatus: SpouseStatus;
  spouseIncome: number;
  dependentGeneral: number;
  dependentSpecific: number;
  dependentElderly: number;
  dependentElderlyLiving: number;
  hasHousingLoanCredit: boolean;
  occupancyYear: number;
  housingLoanRate: number;
  housingLoanYearEndBalance: number;
  housingLoanPossibleAmount: number;
}

export interface NumericFormState {
  taxYear: number;
  income: NumericIncomeInput;
  deductions: NumericDeductionInput;
  family: NumericFamilyInput;
}

export function normalizeForm(form: SimulatorFormState): NumericFormState {
  const occupancyYear = toAmount(form.family.occupancyYear);
  return {
    taxYear: toAmount(form.taxYear),
    income: {
      primarySalaryRevenue: toAmount(form.income.primarySalaryRevenue),
      sideSalaryRevenue: toAmount(form.income.sideSalaryRevenue),
      businessRevenue: toAmount(form.income.businessRevenue),
      businessExpenses: toAmount(form.income.businessExpenses),
      blueSpecialDeduction: toAmount(form.income.blueSpecialDeduction),
      otherIncome: toAmount(form.income.otherIncome),
    },
    deductions: {
      socialInsurance: toAmount(form.deductions.socialInsurance),
      lifeInsurance: toAmount(form.deductions.lifeInsurance),
      earthquakeInsurance: toAmount(form.deductions.earthquakeInsurance),
      ideco: toAmount(form.deductions.ideco),
      medicalExpense: toAmount(form.deductions.medicalExpense),
    },
    family: {
      spouseStatus: form.family.spouseStatus,
      spouseIncome: toAmount(form.family.spouseIncome),
      dependentGeneral: toAmount(form.family.dependentGeneral),
      dependentSpecific: toAmount(form.family.dependentSpecific),
      dependentElderly: toAmount(form.family.dependentElderly),
      dependentElderlyLiving: toAmount(form.family.dependentElderlyLiving),
      hasHousingLoanCredit: form.family.hasHousingLoanCredit,
      occupancyYear,
      housingLoanRate: form.family.housingLoanRate === "" ? 0 : form.family.housingLoanRate,
      housingLoanYearEndBalance: toAmount(form.family.housingLoanYearEndBalance),
      housingLoanPossibleAmount: toAmount(form.family.housingLoanPossibleAmount),
    },
  };
}

export interface BreakdownLine {
  label: string;
  amount: number;
  note?: string;
  unit?: "yen" | "percent";
}

export interface CalculationResult {
  primarySalaryIncome: number;
  sideSalaryIncome: number;
  totalSalaryIncome: number;
  businessIncomeRaw: number;
  businessIncome: number;
  otherIncome: number;
  totalIncome: number;
  incomeDeductionsTotal: number;
  taxableIncomeIncomeTax: number;
  taxableIncomeResidentTax: number;
  marginalIncomeTaxRate: number;
  incomeTaxBeforeCredits: number;
  incomeTaxAfterCredits: number;
  residentTaxIncomeLevy: number;
  furusatoLimit: number;
  effectiveDonationCap: number;
  housingLoanRate: number;
  housingLoanPossibleAmount: number;
  housingLoanUsedOnIncomeTax: number;
  housingLoanResidentTaxCredit: number;
  housingLoanUnusedCredit: number;
  filingNeedsTaxReturn: boolean;
  filingCanUseOneStop: boolean;
  filingReasons: { id: string; title: string; detail: string }[];
  breakdown: {
    income: BreakdownLine[];
    deductions: BreakdownLine[];
    tax: BreakdownLine[];
    furusato: BreakdownLine[];
  };
  notices: string[];
}

export const defaultFormState = (): SimulatorFormState => ({
  taxYear: "",
  income: {
    primarySalaryRevenue: "",
    sideSalaryRevenue: "",
    businessRevenue: "",
    businessExpenses: "",
    blueSpecialDeduction: "",
    otherIncome: "",
  },
  deductions: {
    socialInsurance: "",
    lifeInsurance: "",
    earthquakeInsurance: "",
    ideco: "",
    medicalExpense: "",
  },
  family: {
    spouseStatus: "none",
    spouseIncome: "",
    dependentGeneral: "",
    dependentSpecific: "",
    dependentElderly: "",
    dependentElderlyLiving: "",
    hasHousingLoanCredit: false,
    occupancyYear: "",
    housingLoanRate: "",
    housingLoanYearEndBalance: "",
    housingLoanPossibleAmount: "",
  },
});
