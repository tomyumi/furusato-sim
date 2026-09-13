import { calcIncomeTaxDeductions, calcResidentTaxDeductions } from "@/lib/calc/deductions";
import { assessFilingRequirement } from "@/lib/calc/filing";
import { calcFurusatoLimit } from "@/lib/calc/furusato";
import { applyHousingLoanCredit } from "@/lib/calc/housingLoan";
import {
  calcBusinessIncome,
  calcSalaryIncome,
  calcSalaryIncomeDeduction,
} from "@/lib/calc/income";
import {
  calcAdjustmentDeduction,
  calcIncomeTaxWithSurtax,
  calcResidentTaxIncomeLevy,
  getMarginalIncomeTaxRate,
} from "@/lib/calc/tax";
import type { CalculationResult, SimulatorFormState } from "@/lib/types";
import { normalizeForm } from "@/lib/types";

export function calculateFurusatoLimit(rawForm: SimulatorFormState): CalculationResult {
  const form = normalizeForm(rawForm);
  const { income, deductions, family } = form;
  const notices: string[] = [];
  const filing = assessFilingRequirement(form);

  const primaryRev = Math.max(0, Math.floor(income.primarySalaryRevenue));
  const sideRev = Math.max(0, Math.floor(income.sideSalaryRevenue));
  const totalSalaryRevenue = primaryRev + sideRev;

  const primarySalaryIncome = calcSalaryIncome(primaryRev);
  const sideSalaryIncome = calcSalaryIncome(sideRev);

  const salaryDeduction = calcSalaryIncomeDeduction(totalSalaryRevenue);
  const totalSalaryIncome =
    totalSalaryRevenue > 0
      ? Math.max(0, Math.floor(totalSalaryRevenue - salaryDeduction))
      : 0;

  const businessIncomeRaw = calcBusinessIncome(
    Math.max(0, Math.floor(income.businessRevenue)),
    Math.max(0, Math.floor(income.businessExpenses)),
    income.blueSpecialDeduction,
  );

  const otherIncome = Math.floor(income.otherIncome);

  let businessIncome = businessIncomeRaw;
  let salaryAfterLoss = totalSalaryIncome;
  let otherAfterLoss = otherIncome;

  if (businessIncomeRaw < 0) {
    let loss = -businessIncomeRaw;
    const fromSalary = Math.min(salaryAfterLoss, loss);
    salaryAfterLoss -= fromSalary;
    loss -= fromSalary;
    const fromOther = Math.min(Math.max(0, otherAfterLoss), loss);
    otherAfterLoss -= fromOther;
    loss -= fromOther;
    businessIncome = loss > 0 ? -loss : 0;
    notices.push(
      "事業所得が赤字のため、給与所得・その他所得と損益通算しています（簡易計算）。実際の通算ルール・繰越控除は税理士または税務署にご確認ください。",
    );
  }

  const totalIncome = Math.max(
    0,
    salaryAfterLoss + Math.max(0, businessIncome) + Math.max(0, otherAfterLoss),
  );

  if (income.blueSpecialDeduction > 0) {
    notices.push(
      `青色申告特別控除 ${income.blueSpecialDeduction.toLocaleString()}円 を事業所得から控除しています。電子申告・複式簿記などの要件を満たさない場合は控除額が異なります。`,
    );
  }

  const incomeTaxDeds = calcIncomeTaxDeductions(totalIncome, deductions, family);
  const residentTaxDeds = calcResidentTaxDeductions(totalIncome, deductions, family);

  const taxableIncomeIncomeTax = Math.max(0, Math.floor(totalIncome - incomeTaxDeds.total));
  const taxableIncomeResidentTax = Math.max(
    0,
    Math.floor(totalIncome - residentTaxDeds.total),
  );

  const marginalIncomeTaxRate = getMarginalIncomeTaxRate(taxableIncomeIncomeTax);
  const incomeTaxBeforeCreditsWithSurtax = calcIncomeTaxWithSurtax(taxableIncomeIncomeTax);
  const humanDiff = Math.max(0, incomeTaxDeds.total - residentTaxDeds.total);
  const adjustmentDeduction = calcAdjustmentDeduction(humanDiff);

  const residentTaxBeforeHousing = calcResidentTaxIncomeLevy(
    taxableIncomeResidentTax,
    adjustmentDeduction,
    0,
  );

  let incomeTaxAfterCredits = incomeTaxBeforeCreditsWithSurtax;
  let housingLoanRate = 0;
  let housingLoanPossibleAmount = 0;
  let housingLoanUsedOnIncomeTax = 0;
  let housingResidentCredit = 0;
  let housingLoanUnusedCredit = 0;

  if (family.hasHousingLoanCredit) {
    const h = applyHousingLoanCredit({
      occupancyYear: family.occupancyYear,
      rate: family.housingLoanRate,
      yearEndBalance: family.housingLoanYearEndBalance,
      possibleAmountFromSlip: family.housingLoanPossibleAmount,
      incomeTaxWithSurtax: incomeTaxBeforeCreditsWithSurtax,
      taxableIncomeIncomeTax,
      residentTaxBeforeHousing,
    });
    housingLoanRate = h.rate;
    housingLoanPossibleAmount = h.possibleAmount;
    housingLoanUsedOnIncomeTax = h.usedOnIncomeTax;
    housingResidentCredit = h.residentTaxCredit;
    housingLoanUnusedCredit = h.unusedCredit;
    incomeTaxAfterCredits = h.incomeTaxAfterWithSurtax;

    if (h.source === "slip") {
      notices.push(
        "住宅借入金等特別控除可能額（源泉徴収票の記載）を優先して控除額に使っています。",
      );
    } else if (h.source === "balance") {
      notices.push(
        `住宅借入金等年末残高 × 控除率${(h.rate * 100).toFixed(1)}% で控除可能額を計算しています。`,
      );
    }

    if (h.leftoverAfterIncomeTax > 0) {
      notices.push(
        `所得税から引ききれなかった ${h.leftoverAfterIncomeTax.toLocaleString()}円のうち、住民税から ${h.residentTaxCredit.toLocaleString()}円 を控除します（${h.residentTaxLimit.note}）。`,
      );
    }
    if (h.unusedCredit > 0) {
      notices.push(
        `住民税の上限を超えた ${h.unusedCredit.toLocaleString()}円 は控除できません（切り捨て）。ふるさと納税の上限計算ではこの切れ分は使えません。`,
      );
    }
  }

  const residentTaxIncomeLevy = calcResidentTaxIncomeLevy(
    taxableIncomeResidentTax,
    adjustmentDeduction,
    housingResidentCredit,
  );

  const { limit: furusatoLimit, lines: furusatoLines } = calcFurusatoLimit(
    residentTaxIncomeLevy,
    marginalIncomeTaxRate,
  );

  return {
    primarySalaryIncome,
    sideSalaryIncome,
    totalSalaryIncome: salaryAfterLoss,
    businessIncomeRaw,
    businessIncome: Math.max(0, businessIncome),
    otherIncome: Math.max(0, otherAfterLoss),
    totalIncome,
    incomeDeductionsTotal: incomeTaxDeds.total,
    taxableIncomeIncomeTax,
    taxableIncomeResidentTax,
    marginalIncomeTaxRate,
    incomeTaxBeforeCredits: incomeTaxBeforeCreditsWithSurtax,
    incomeTaxAfterCredits,
    residentTaxIncomeLevy,
    furusatoLimit,
    effectiveDonationCap: furusatoLimit,
    housingLoanRate,
    housingLoanPossibleAmount,
    housingLoanUsedOnIncomeTax,
    housingLoanResidentTaxCredit: housingResidentCredit,
    housingLoanUnusedCredit,
    filingNeedsTaxReturn: filing.needsTaxReturn,
    filingCanUseOneStop: filing.canUseOneStop,
    filingReasons: filing.reasons,
    breakdown: {
      income: [
        { label: "支払金額（本業の源泉徴収票）", amount: primaryRev },
        { label: "支払金額（副業の源泉徴収票）", amount: sideRev },
        { label: "支払金額の合計", amount: totalSalaryRevenue },
        { label: "給与所得控除", amount: -Math.floor(salaryDeduction) },
        { label: "給与所得控除後の金額（通算前）", amount: totalSalaryIncome },
        {
          label: "事業所得（青色控除後）",
          amount: businessIncomeRaw,
          note:
            businessIncomeRaw < 0
              ? "赤字のため損益通算対象"
              : income.blueSpecialDeduction > 0
                ? `青色申告特別控除 ${income.blueSpecialDeduction.toLocaleString()}円適用`
                : undefined,
        },
        { label: "その他所得", amount: otherIncome },
        { label: "総所得金額等", amount: totalIncome },
      ],
      deductions: incomeTaxDeds.lines.map((line) => {
        if (line.label === "社会保険料控除") return { ...line, label: "社会保険料等の金額" };
        if (line.label === "生命保険料控除") return { ...line, label: "生命保険料の控除額" };
        if (line.label === "地震保険料控除") return { ...line, label: "地震保険料の控除額" };
        if (line.label === "小規模企業共済等掛金控除（iDeCo等）") {
          return { ...line, label: "小規模企業共済等掛金の金額" };
        }
        return line;
      }),
      tax: [
        { label: "課税所得（所得税）", amount: taxableIncomeIncomeTax },
        { label: "課税所得（住民税）", amount: taxableIncomeResidentTax },
        {
          label: "所得税（復興特別所得税込・住宅ローン控除前）",
          amount: incomeTaxBeforeCreditsWithSurtax,
        },
        {
          label: "住宅借入金等特別控除可能額",
          amount: housingLoanPossibleAmount,
        },
        {
          label: "所得税から使い切った住宅ローン控除",
          amount: housingLoanUsedOnIncomeTax,
          note: "復興特別所得税込みの所得税が0円になるまで先に充当",
        },
        {
          label: "所得税の残り（復興特別所得税込）",
          amount: incomeTaxAfterCredits,
        },
        {
          label: "所得税から引ききれず住民税へ振り替えた額",
          amount: housingResidentCredit,
        },
        {
          label: "住民税の上限超過で控除できない額",
          amount: housingLoanUnusedCredit,
        },
        { label: "調整控除（概算）", amount: adjustmentDeduction },
        { label: "住民税所得割額", amount: residentTaxIncomeLevy },
      ],
      furusato: furusatoLines,
    },
    notices,
  };
}
