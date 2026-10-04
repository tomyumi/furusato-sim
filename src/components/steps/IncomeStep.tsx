"use client";

import { NumberField } from "@/components/ui/NumberField";
import type { BlueSpecialDeduction, IncomeInput, OptionalNumber } from "@/lib/types";

interface IncomeStepProps {
  value: IncomeInput;
  taxYear: OptionalNumber;
  occupancyYear: OptionalNumber;
  onChange: (next: IncomeInput) => void;
  onTaxYearChange: (year: OptionalNumber) => void;
  onOccupancyYearChange: (year: OptionalNumber) => void;
}

const BLUE_OPTIONS: { value: BlueSpecialDeduction | ""; label: string }[] = [
  { value: "", label: "未選択" },
  { value: 0, label: "適用なし（白色など）" },
  { value: 100000, label: "10万円（簡易帳簿など）" },
  { value: 550000, label: "55万円（複式・紙申告など）" },
  { value: 650000, label: "65万円（複式・電子申告）" },
];

export function IncomeStep({
  value,
  taxYear,
  occupancyYear,
  onChange,
  onTaxYearChange,
  onOccupancyYearChange,
}: IncomeStepProps) {
  const patch = (partial: Partial<IncomeInput>) => onChange({ ...value, ...partial });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h3 className="font-display text-2xl text-ink-950">源泉徴収票の金額を書き写す</h3>
        <p className="text-sm leading-7 text-ink-600">
          空欄のまま次へ進んでも、未入力は0円として計算します。分かる欄だけ書いて、限度額の目安を出してください。
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="対象年"
          value={taxYear}
          onChange={onTaxYearChange}
          hint="源泉徴収票に書いてある年（例: 2025）。手入力してください。"
          suffix="年"
          min={1990}
          max={2100}
        />
        <NumberField
          label="居住開始年"
          value={occupancyYear}
          onChange={onOccupancyYearChange}
          hint="家に住み始めた年。住宅ローン控除がある人だけ入力。例: 2020"
          suffix="年"
          min={1990}
          max={2100}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="支払金額（本業）"
          badge="源泉徴収票"
          value={value.primarySalaryRevenue}
          onChange={(primarySalaryRevenue) => patch({ primarySalaryRevenue })}
          hint="1枚目の源泉徴収票の「支払金額」。"
          min={0}
          step={10000}
        />
        <NumberField
          label="支払金額（副業・2枚目）"
          badge="源泉徴収票"
          value={value.sideSalaryRevenue}
          onChange={(sideSalaryRevenue) => patch({ sideSalaryRevenue })}
          hint="副業の源泉徴収票があるときだけ。なければ空欄。"
          min={0}
          step={10000}
        />
      </div>

      <div className="card-gold space-y-4">
        <h3 className="font-display text-lg text-cedar-950">事業所得（ない人は空欄のまま）</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="売上（収入金額）"
            badge="確定申告"
            value={value.businessRevenue}
            onChange={(businessRevenue) => patch({ businessRevenue })}
            min={0}
            step={10000}
          />
          <NumberField
            label="必要経費"
            badge="確定申告"
            value={value.businessExpenses}
            onChange={(businessExpenses) => patch({ businessExpenses })}
            min={0}
            step={10000}
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink-800">青色申告特別控除</span>
          <select
            className="field-select"
            value={value.blueSpecialDeduction === "" ? "" : String(value.blueSpecialDeduction)}
            suppressHydrationWarning
            onChange={(e) =>
              patch({
                blueSpecialDeduction:
                  e.target.value === ""
                    ? ""
                    : (Number(e.target.value) as BlueSpecialDeduction),
              })
            }
          >
            {BLUE_OPTIONS.map((o) => (
              <option key={String(o.value)} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <NumberField
        label="その他の所得（雑所得など）"
        badge="任意"
        value={value.otherIncome}
        onChange={(otherIncome) => patch({ otherIncome })}
        hint="なければ空欄。"
        step={10000}
      />
    </section>
  );
}
