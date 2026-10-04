import { formatInputYear, formatYen } from "@/lib/format";
import { toAmount, type OptionalNumber } from "@/lib/numbers";
import { getSiteUrl } from "@/lib/seo";
import type { CalculationResult, SimulatorFormState } from "@/lib/types";

function yenIfEntered(value: OptionalNumber): string | null {
  if (value === "") return null;
  return formatYen(toAmount(value));
}

export function simulationSharePageUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/`;
  }
  return `${getSiteUrl()}/`;
}

/** LINEトークに貼るシミュレーション結果の本文 */
export function buildSimulationShareText(
  form: SimulatorFormState,
  result: CalculationResult,
  pageUrl: string,
): string {
  const lines: string[] = [
    "【ふるさと納税 控除上限額】",
    "自己負担2,000円で寄付できる上限（目安）",
    formatYen(result.furusatoLimit),
    "",
    "■主な条件",
    `対象年：${formatInputYear(form.taxYear)}`,
  ];

  if (form.family.occupancyYear !== "") {
    lines.push(`居住開始年：${formatInputYear(form.family.occupancyYear)}`);
  }

  const primary = yenIfEntered(form.income.primarySalaryRevenue);
  if (primary) lines.push(`支払金額（本業の給与）：${primary}`);
  const side = yenIfEntered(form.income.sideSalaryRevenue);
  if (side) lines.push(`支払金額（副業の給与）：${side}`);
  const business = yenIfEntered(form.income.businessRevenue);
  if (business) lines.push(`事業の売上：${business}`);
  const other = yenIfEntered(form.income.otherIncome);
  if (other) lines.push(`その他の所得：${other}`);

  if (form.family.hasHousingLoanCredit) {
    lines.push("住宅ローン控除：あり");
  }

  lines.push(
    "",
    "※簡易シミュレーションの目安です。最終判断は税務署または税理士等へ。",
    "",
    pageUrl,
  );

  return lines.join("\n");
}

/**
 * LINEでトークに送るURL。
 * 算出額を本文に載せるためテキスト埋め込み（msg/text）を使い、
 * サイトURLも本文末尾に含める。
 */
export function buildLineShareHref(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

/** URLだけ共有する場合の LINE It（OGP用）。算出額は含まれない。 */
export function buildLineItShareHref(pageUrl: string): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;
}
