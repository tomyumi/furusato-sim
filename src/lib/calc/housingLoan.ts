/**
 * 住宅借入金等特別控除
 * 控除率の目安は居住開始年から era ルールで判定。ユーザーが手で上書きした率も計算に使う。
 */

import {
  currentHousingLoanEra,
  findHousingLoanEra,
  formatHousingLoanRatePercent,
} from "@/lib/calc/housingLoanRules";

function yen(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.trunc(n));
}

export function formatDeductionRatePercent(rate: number): string {
  return formatHousingLoanRatePercent(rate);
}

export interface ResidentTaxHousingLoanLimit {
  percent: number;
  yenCap: number;
  cap: number;
  note: string;
}

export function getResidentTaxHousingLoanLimit(
  occupancyYear: number,
  taxableIncomeIncomeTax: number,
): ResidentTaxHousingLoanLimit {
  const taxable = yen(taxableIncomeIncomeTax);
  const era = findHousingLoanEra(occupancyYear) ?? currentHousingLoanEra();
  const percent = era.residentTaxPercent;
  const yenCap = era.residentTaxYenCap;
  const percentLabel = Number((percent * 100).toFixed(2));
  const note = `住民税からの控除上限は、所得税の課税総所得金額等×${percentLabel}%（最高${yenCap.toLocaleString("ja-JP")}円）です。`;

  return {
    percent,
    yenCap,
    cap: Math.min(Math.trunc(taxable * percent), yenCap),
    note,
  };
}

export interface HousingLoanCreditResult {
  rate: number;
  fromBalance: number;
  possibleAmount: number;
  source: "slip" | "balance" | "none";
  incomeTaxWithSurtaxBefore: number;
  usedOnIncomeTax: number;
  incomeTaxAfterWithSurtax: number;
  leftoverAfterIncomeTax: number;
  residentTaxLimit: ResidentTaxHousingLoanLimit;
  residentTaxCredit: number;
  unusedCredit: number;
}

export function applyHousingLoanCredit(params: {
  occupancyYear: number;
  rate: number;
  yearEndBalance: number;
  possibleAmountFromSlip: number;
  incomeTaxWithSurtax: number;
  taxableIncomeIncomeTax: number;
  residentTaxBeforeHousing: number;
}): HousingLoanCreditResult {
  const rate = params.rate > 0 ? params.rate : 0;
  const balance = yen(params.yearEndBalance);
  const fromBalance = balance > 0 && rate > 0 ? Math.trunc(balance * rate) : 0;
  const slip = yen(params.possibleAmountFromSlip);

  let possibleAmount = 0;
  let source: HousingLoanCreditResult["source"] = "none";
  if (slip > 0) {
    possibleAmount = slip;
    source = "slip";
  } else if (fromBalance > 0) {
    possibleAmount = fromBalance;
    source = "balance";
  }

  const incomeTaxWithSurtaxBefore = yen(params.incomeTaxWithSurtax);
  const usedOnIncomeTax = Math.min(possibleAmount, incomeTaxWithSurtaxBefore);
  const incomeTaxAfterWithSurtax = incomeTaxWithSurtaxBefore - usedOnIncomeTax;
  const leftoverAfterIncomeTax = possibleAmount - usedOnIncomeTax;

  const residentTaxLimit = getResidentTaxHousingLoanLimit(
    params.occupancyYear,
    params.taxableIncomeIncomeTax,
  );
  const residentTaxBefore = yen(params.residentTaxBeforeHousing);
  const residentTaxCredit = Math.min(
    leftoverAfterIncomeTax,
    residentTaxLimit.cap,
    residentTaxBefore,
  );
  const unusedCredit = leftoverAfterIncomeTax - residentTaxCredit;

  return {
    rate,
    fromBalance,
    possibleAmount,
    source,
    incomeTaxWithSurtaxBefore,
    usedOnIncomeTax,
    incomeTaxAfterWithSurtax,
    leftoverAfterIncomeTax,
    residentTaxLimit,
    residentTaxCredit,
    unusedCredit,
  };
}
