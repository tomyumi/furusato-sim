"use client";

import { NumberField } from "@/components/ui/NumberField";
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

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h3 className="font-display text-2xl text-ink-950">控除の金額を書き写す</h3>
        <p className="text-sm leading-7 text-ink-600">
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
            {estimatedSocialInsurance.toLocaleString()}円）
          </button>
        ) : null}

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
    </section>
  );
}
