"use client";

import { Accordion } from "@/components/ui/Accordion";
import { NumberField } from "@/components/ui/NumberField";
import { formatInteger } from "@/lib/format";
import { toAmount } from "@/lib/numbers";
import type { DeductionInput } from "@/lib/types";

interface DeductionsStepProps {
  value: DeductionInput;
  onChange: (next: DeductionInput) => void;
  estimatedSocialInsurance?: number;
}

export function DeductionsStep({
  value,
  onChange,
  estimatedSocialInsurance,
}: DeductionsStepProps) {
  const patch = (partial: Partial<DeductionInput>) => onChange({ ...value, ...partial });
  const optionalFilled =
    toAmount(value.lifeInsurance) > 0 ||
    toAmount(value.earthquakeInsurance) > 0 ||
    toAmount(value.ideco) > 0 ||
    toAmount(value.medicalExpense) > 0;
  const optionalSummary = optionalFilled
    ? [
        toAmount(value.lifeInsurance) > 0
          ? `生命 ${formatInteger(toAmount(value.lifeInsurance))}円`
          : null,
        toAmount(value.earthquakeInsurance) > 0
          ? `地震 ${formatInteger(toAmount(value.earthquakeInsurance))}円`
          : null,
        toAmount(value.ideco) > 0 ? `iDeCo等 ${formatInteger(toAmount(value.ideco))}円` : null,
        toAmount(value.medicalExpense) > 0
          ? `医療費 ${formatInteger(toAmount(value.medicalExpense))}円`
          : null,
      ]
        .filter(Boolean)
        .join("・")
    : "未入力（0円として計算）";

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h3 className="font-display text-2xl text-ink-950">控除の金額を書き写す</h3>
        <p className="section-copy">
          空欄の項目は0円として扱います。源泉徴収票に書いてある数字だけ入力してください。
        </p>
      </header>

      <div className="space-y-5">
        <NumberField
          label="社会保険料等の金額"
          badge="源泉徴収票"
          value={value.socialInsurance}
          onChange={(socialInsurance) => patch({ socialInsurance })}
          hint="源泉徴収票の「社会保険料等の金額」。"
          min={0}
          step={1000}
        />
        {estimatedSocialInsurance != null && estimatedSocialInsurance > 0 ? (
          <button
            type="button"
            className="text-sm font-medium text-cedar-800 underline-offset-2 hover:underline"
            onClick={() => patch({ socialInsurance: estimatedSocialInsurance })}
          >
            見つからないとき：支払金額の約15%で概算する（
            {formatInteger(estimatedSocialInsurance)}円）
          </button>
        ) : null}

        <Accordion
          variant="form"
          title="生命保険料・地震保険料・iDeCo・医療費"
          summary={optionalSummary}
          defaultOpen={optionalFilled}
        >
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="生命保険料の控除額"
                badge="源泉徴収票"
                value={value.lifeInsurance}
                onChange={(lifeInsurance) => patch({ lifeInsurance })}
                hint="源泉徴収票の「生命保険料の控除額」。"
                min={0}
                max={120000}
                step={1000}
              />
              <NumberField
                label="地震保険料の控除額"
                badge="源泉徴収票"
                value={value.earthquakeInsurance}
                onChange={(earthquakeInsurance) => patch({ earthquakeInsurance })}
                hint="源泉徴収票の「地震保険料の控除額」。"
                min={0}
                max={50000}
                step={1000}
              />
            </div>

            <NumberField
              label="小規模企業共済等掛金の金額（iDeCo含む）"
              badge="源泉徴収票"
              value={value.ideco}
              onChange={(ideco) => patch({ ideco })}
              hint="源泉徴収票の「小規模企業共済等掛金の金額」。iDeCo（個人型確定拠出年金）の年間払込額もここに入ります。票に書いていなければ、iDeCoの年間払込額を書いてください。"
              min={0}
              step={1000}
            />

            <NumberField
              label="医療費控除"
              badge="確定申告"
              value={value.medicalExpense}
              onChange={(medicalExpense) => patch({ medicalExpense })}
              hint="確定申告で使うときだけ。使わない人は空欄。"
              min={0}
              step={1000}
            />
          </div>
        </Accordion>
      </div>
    </section>
  );
}
