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

export type TriState = "yes" | "no" | "unknown";

export interface FilingAdvisorAnswers {
  plansOtherReturn: TriState;
  municipalitiesWithinFive: TriState;
}

export const defaultFilingAdvisorAnswers = (): FilingAdvisorAnswers => ({
  plansOtherReturn: "unknown",
  municipalitiesWithinFive: "unknown",
});

export type FilingVerdict = "oneStop" | "taxReturn" | "checkAnswers";

export interface FilingCheck {
  id: string;
  label: string;
  status: "pass" | "fail" | "pending";
  note: string;
}

export interface FilingDeadlines {
  oneStop: string;
  taxReturn: string;
}

export interface FilingAdvice {
  verdict: FilingVerdict;
  headline: string;
  subhead: string;
  formReasons: FilingReason[];
  extraReasons: FilingReason[];
  allReasons: FilingReason[];
  checks: FilingCheck[];
  deadlines: FilingDeadlines;
}

export function filingDeadlines(now?: Date): FilingDeadlines {
  if (!now) {
    return {
      oneStop: "寄付した年の翌年1月10日（必着）",
      taxReturn: "翌年2月16日〜3月15日頃",
    };
  }
  const nextYear = now.getFullYear() + 1;
  return {
    oneStop: `${nextYear}年1月10日（必着）`,
    taxReturn: `${nextYear}年2月16日〜3月15日頃`,
  };
}

export function assessFilingRequirement(form: NumericFormState): FilingAssessment {
  const reasons: FilingReason[] = [];
  const { income, deductions, family, taxYear } = form;
  const salaryRevenue = income.primarySalaryRevenue + income.sideSalaryRevenue;

  if (salaryRevenue > 20_000_000) {
    reasons.push({
      id: "salary-20m",
      title: "給与収入が2,000万円を超える",
      detail:
        "給与の収入金額が2,000万円を超える人は確定申告が必要です。ワンストップ特例は使えません。",
    });
  }

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

export function adviseFiling(
  form: NumericFormState,
  answers: FilingAdvisorAnswers,
  now?: Date,
): FilingAdvice {
  const base = assessFilingRequirement(form);
  const extraReasons: FilingReason[] = [];
  const deadlines = filingDeadlines(now);

  if (answers.plansOtherReturn === "yes") {
    extraReasons.push({
      id: "plans-return",
      title: "もともと確定申告や医療費・住宅ローン控除の予定がある",
      detail:
        "確定申告をするとワンストップ特例は無効になります。ふるさと納税も同じ申告でまとめて控除してください。",
    });
  }

  if (answers.municipalitiesWithinFive === "no") {
    extraReasons.push({
      id: "over-five",
      title: "寄付先が6自治体以上",
      detail:
        "ワンストップ特例は、1年間の寄付先が5自治体内に限られます。同じ自治体への複数回は1自治体と数えます。6以上なら確定申告が必要です。",
    });
  }

  const formBlocks = base.needsTaxReturn;
  const extraBlocks = extraReasons.length > 0;
  const answersComplete =
    answers.plansOtherReturn !== "unknown" && answers.municipalitiesWithinFive !== "unknown";

  let verdict: FilingVerdict;
  if (formBlocks || extraBlocks) {
    verdict = "taxReturn";
  } else if (!answersComplete) {
    verdict = "checkAnswers";
  } else {
    verdict = "oneStop";
  }

  const checks: FilingCheck[] = [
    {
      id: "salary-return",
      label: "確定申告が不要な給与所得者である",
      status: formBlocks ? "fail" : "pass",
      note: formBlocks
        ? "入力内容から、確定申告が必要（またはワンストップ対象外）と判断しました。"
        : "副業給与・事業所得・医療費控除・住宅ローン初年度など、申告が必要になる入力はありません。",
    },
    {
      id: "other-plans",
      label: "医療費控除・住宅ローン控除などで別途申告する予定がない",
      status:
        answers.plansOtherReturn === "yes"
          ? "fail"
          : answers.plansOtherReturn === "no"
            ? "pass"
            : "pending",
      note:
        answers.plansOtherReturn === "yes"
          ? "申告するなら、ふるさと納税も確定申告に含めます。"
          : answers.plansOtherReturn === "no"
            ? "ふるさと納税だけなら、ワンストップ特例の申請書で足ります。"
            : "予定があるかどうかを選んでください。",
    },
    {
      id: "five-muni",
      label: "1年間の寄付先が5自治体内",
      status:
        answers.municipalitiesWithinFive === "no"
          ? "fail"
          : answers.municipalitiesWithinFive === "yes"
            ? "pass"
            : "pending",
      note:
        answers.municipalitiesWithinFive === "no"
          ? "6自治体以上への寄付はワンストップ特例の対象外です。"
          : answers.municipalitiesWithinFive === "yes"
            ? "同じ自治体への複数回寄付は、1自治体として数えます。"
            : "寄付先の数を選んでください。",
    },
  ];

  const allReasons = [...base.reasons, ...extraReasons];

  const copy = verdictCopy(verdict, allReasons);

  return {
    verdict,
    headline: copy.headline,
    subhead: copy.subhead,
    formReasons: base.reasons,
    extraReasons,
    allReasons,
    checks,
    deadlines,
  };
}

function verdictCopy(
  verdict: FilingVerdict,
  reasons: FilingReason[],
): { headline: string; subhead: string } {
  if (verdict === "oneStop") {
    return {
      headline: "あなたはワンストップ特例制度が利用可能です（申請書の提出だけでOK！）",
      subhead:
        "会社の年末調整だけで所得税が済む給与所得者向けの手続きです。各自治体へ申請書を出せば、確定申告をしなくても住民税から控除されます。",
    };
  }

  if (verdict === "checkAnswers") {
    return {
      headline: "入力内容ではワンストップ特例の候補です。上の質問で最終判定します",
      subhead:
        "副業や医療費控除など、確定申告が必要になる入力はありません。寄付先の自治体数と、ほかの申告予定を選ぶとアドバイスが確定します。",
    };
  }

  const housing = reasons.some((r) => r.id === "housing-first-year" || r.id === "plans-return");
  const medical = reasons.some((r) => r.id === "medical");
  const overFive = reasons.some((r) => r.id === "over-five");

  if (overFive && reasons.length === 1) {
    return {
      headline: "あなたは確定申告が必要です（寄付先が6自治体以上のため）",
      subhead:
        "ワンストップ特例は使えません。寄附金の受領証明書をそろえて、確定申告でふるさと納税を申告してください。",
    };
  }

  if (housing || medical) {
    return {
      headline: "あなたは確定申告が必要です（住宅ローン控除や医療費控除とまとめられます）",
      subhead:
        "確定申告をするとワンストップ特例は無効になります。ふるさと納税も同じ申告に含めてください。",
    };
  }

  return {
    headline: "あなたは確定申告が必要です（ワンストップ特例は使えません）",
    subhead:
      "入力内容または追加の回答から、確定申告でふるさと納税を控除する必要があります。",
  };
}
