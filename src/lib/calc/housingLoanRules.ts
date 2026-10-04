/**
 * 住宅ローン控除の入居年別ルール。
 * 法改正時は、直近の era の occupancyTo を閉じてから新しい era を末尾に足す。
 * 期間は重複させない（先にマッチした era が使われる）。
 */

import type { OptionalNumber } from "@/lib/numbers";

export const HOUSING_LOAN_OCCUPANCY_YEAR_MIN = 1990;
export const HOUSING_LOAN_OCCUPANCY_YEAR_MAX = 2100;

export interface HousingLoanCreditEra {
  /** 居住開始年の開始（含む）。null は下限なし */
  occupancyFrom: number | null;
  /** 居住開始年の終了（含む）。null は上限なし（現行） */
  occupancyTo: number | null;
  /** 所得税の住宅ローン控除率（年末残高に対する割合） */
  incomeTaxRate: number;
  /** 住民税からの控除：課税総所得金額等に掛ける率 */
  residentTaxPercent: number;
  /** 住民税からの控除：金額上限 */
  residentTaxYenCap: number;
}

export const HOUSING_LOAN_CREDIT_ERAS: readonly HousingLoanCreditEra[] = [
  {
    occupancyFrom: null,
    occupancyTo: 2021,
    incomeTaxRate: 0.01,
    residentTaxPercent: 0.07,
    residentTaxYenCap: 136_500,
  },
  {
    occupancyFrom: 2022,
    occupancyTo: null,
    incomeTaxRate: 0.007,
    residentTaxPercent: 0.05,
    residentTaxYenCap: 97_500,
  },
];

export function formatHousingLoanRatePercent(rate: number): string {
  if (!rate) return "未入力";
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatEraOccupancyPhrase(era: HousingLoanCreditEra): string {
  const { occupancyFrom: from, occupancyTo: to } = era;
  if (from == null && to == null) return "入居年を問わず";
  if (from == null) return `${to}年以前に入居`;
  if (to == null) return `${from}年以降に入居`;
  if (from === to) return `${from}年に入居`;
  return `${from}〜${to}年に入居`;
}

export function findHousingLoanEra(occupancyYear: number): HousingLoanCreditEra | undefined {
  const year = Math.trunc(occupancyYear);
  if (!Number.isFinite(year) || year <= 0) return undefined;
  return HOUSING_LOAN_CREDIT_ERAS.find((era) => {
    const fromOk = era.occupancyFrom == null || year >= era.occupancyFrom;
    const toOk = era.occupancyTo == null || year <= era.occupancyTo;
    return fromOk && toOk;
  });
}

/** 入居年が未入力・範囲外のときは空。計算側の現行ルールは末尾の era を使う。 */
export function currentHousingLoanEra(): HousingLoanCreditEra {
  return HOUSING_LOAN_CREDIT_ERAS[HOUSING_LOAN_CREDIT_ERAS.length - 1];
}

export function suggestHousingLoanRate(occupancyYear: OptionalNumber): number | "" {
  if (occupancyYear === "") return "";
  const year = Math.trunc(occupancyYear);
  if (
    year < HOUSING_LOAN_OCCUPANCY_YEAR_MIN ||
    year > HOUSING_LOAN_OCCUPANCY_YEAR_MAX
  ) {
    return "";
  }
  const era = findHousingLoanEra(year);
  return era ? era.incomeTaxRate : "";
}

export interface HousingLoanRateOption {
  value: string;
  rate: number;
  label: string;
}

/** セレクト用。era を足せば選択肢とラベルが追従する。同じ控除率は期間をまとめる。 */
export function housingLoanRateSelectOptions(): HousingLoanRateOption[] {
  const byRate = new Map<number, HousingLoanCreditEra[]>();
  for (const era of HOUSING_LOAN_CREDIT_ERAS) {
    const list = byRate.get(era.incomeTaxRate) ?? [];
    list.push(era);
    byRate.set(era.incomeTaxRate, list);
  }
  return [...byRate.entries()].map(([rate, eras]) => ({
    value: String(rate),
    rate,
    label: `${formatHousingLoanRatePercent(rate)}（${eras.map(formatEraOccupancyPhrase).join("、")}）`,
  }));
}

export function parseHousingLoanRateChoice(raw: string): number | "" {
  if (raw === "") return "";
  const option = housingLoanRateSelectOptions().find((o) => o.value === raw);
  if (option) return option.rate;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : "";
}

export function withSuggestedHousingLoanRate<
  T extends { occupancyYear: OptionalNumber; housingLoanRate: number | "" },
>(family: T, occupancyYear: OptionalNumber): T {
  const suggested = suggestHousingLoanRate(occupancyYear);
  if (suggested === "") {
    return { ...family, occupancyYear };
  }
  return { ...family, occupancyYear, housingLoanRate: suggested };
}
