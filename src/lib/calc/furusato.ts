import {
  FURUSATO_SPECIAL_CAP_RATIO,
  RECONSTRUCTION_SURTAX,
  RESIDENT_TAX_RATE,
  SELF_BURDEN,
} from "@/lib/constants";
import type { BreakdownLine } from "@/lib/types";
import { formatInteger } from "@/lib/format";

export function calcFurusatoLimit(
  residentTaxIncomeLevy: number,
  marginalIncomeTaxRate: number,
): { limit: number; lines: BreakdownLine[] } {
  if (residentTaxIncomeLevy <= 0) {
    return {
      limit: 0,
      lines: [
        {
          label: "住民税所得割が0円のため上限なし（寄付しても控除対象外の可能性）",
          amount: 0,
        },
      ],
    };
  }

  const specialCap = Math.trunc(residentTaxIncomeLevy * FURUSATO_SPECIAL_CAP_RATIO);
  const denominator =
    1 - RESIDENT_TAX_RATE - marginalIncomeTaxRate * (1 + RECONSTRUCTION_SURTAX);

  const lines: BreakdownLine[] = [
    { label: "住民税所得割額", amount: residentTaxIncomeLevy },
    { label: "特例控除の上限（所得割×20%）", amount: specialCap },
    {
      label: "所得税の限界税率",
      amount: marginalIncomeTaxRate,
      unit: "percent",
    },
    {
      label: "分母（90% − 所得税の限界税率×1.021）",
      amount: denominator,
      unit: "percent",
    },
  ];

  if (denominator <= 0) {
    return {
      limit: SELF_BURDEN,
      lines: [
        ...lines,
        { label: "計算不能（税率が高すぎるため）", amount: SELF_BURDEN, note: "自己負担額のみ" },
      ],
    };
  }

  const limit = Math.trunc(specialCap / denominator) + SELF_BURDEN;
  lines.push({
    label: "控除上限額（寄付限度額）",
    amount: limit,
    note: `自己負担 ${formatInteger(SELF_BURDEN)}円込み`,
  });

  return { limit, lines };
}
