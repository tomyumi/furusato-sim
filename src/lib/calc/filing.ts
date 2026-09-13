import type { NumericFormState } from "@/lib/types";

export interface FilingReason {
  id: string;
  title: string;
  detail: string;
}

export interface FilingAssessment {
  needsTaxReturn: boolean;
  canUseOneStop: boolean;
  reasons: FilingReason[];
}

export function assessFilingRequirement(form: NumericFormState): FilingAssessment {
  const reasons: FilingReason[] = [];
  const { income, deductions, family, taxYear } = form;

  if (income.sideSalaryRevenue > 0) {
    reasons.push({
      id: "side-salary",
      title: "副業の給与（支払金額）がある",
      detail:
        "給与の支払者が2か所以上ある場合、原則として確定申告が必要です。ふるさと納税のワンストップ特例は使えません。",
    });
  }

  if (income.businessRevenue > 0 || income.businessExpenses > 0) {
    reasons.push({
      id: "business",
      title: "事業所得（副業・個人事業）がある",
      detail:
        "事業所得がある場合は確定申告が必要です。ワンストップ特例は使えず、ふるさと納税も確定申告で申告してください。",
    });
  }

  if (income.otherIncome !== 0) {
    reasons.push({
      id: "other-income",
      title: "給与・事業以外の所得がある",
      detail:
        "雑所得などがある場合は確定申告が必要になることがあります。ワンストップ特例は使えない前提で進めてください。",
    });
  }

  if (deductions.medicalExpense > 0) {
    reasons.push({
      id: "medical",
      title: "医療費控除を使う",
      detail:
        "医療費控除は確定申告でしか受けられません。申告する場合、ワンストップ特例は無効になり、ふるさと納税も申告が必要です。",
    });
  }

  if (
    family.hasHousingLoanCredit &&
    taxYear > 0 &&
    family.occupancyYear > 0 &&
    family.occupancyYear === taxYear
  ) {
    reasons.push({
      id: "housing-first-year",
      title: "住宅ローン控除の初年度（居住開始年）",
      detail:
        "入力した対象年と居住開始年が同じため、住宅借入金等特別控除の初年度として扱います。確定申告が必要で、ワンストップ特例は使えません。",
    });
  }

  const needsTaxReturn = reasons.length > 0;
  return {
    needsTaxReturn,
    canUseOneStop: !needsTaxReturn,
    reasons,
  };
}
