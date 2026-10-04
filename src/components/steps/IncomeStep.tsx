"use client";

import { NumberField } from "@/components/ui/NumberField";
import {
  HOUSING_LOAN_OCCUPANCY_YEAR_MAX,
  HOUSING_LOAN_OCCUPANCY_YEAR_MIN,
} from "@/lib/calc/housingLoanRules";
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
        <h3 className="font-display text-2xl text-ink-950">収入の種類ごとに金額を書く</h3>
        <p className="text-sm leading-7 text-ink-600">
          給与は源泉徴収票、事業や雑所得は確定申告の数字を、別々の欄に書いてください。空欄は0円として計算します。分かる欄だけ書いて、限度額の目安を出してください。
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
          hint="家に住み始めた年。住宅ローン控除がある人だけ入力。入れると家族画面の控除率も自動で選びます。例: 2020"
          suffix="年"
          min={HOUSING_LOAN_OCCUPANCY_YEAR_MIN}
          max={HOUSING_LOAN_OCCUPANCY_YEAR_MAX}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg text-ink-950">給与所得（源泉徴収票）</h3>
          <p className="text-sm leading-7 text-ink-600">
            会社・勤務先から受け取った源泉徴収票の「支払金額」です。個人事業の売上や雑所得は、下の確定申告の枠に書いてください。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="支払金額（本業の給与・源泉徴収票）"
            badge="給与所得"
            value={value.primarySalaryRevenue}
            onChange={(primarySalaryRevenue) => patch({ primarySalaryRevenue })}
            hint="1枚目の源泉徴収票の「支払金額」"
            min={0}
            step={10000}
          />
          <NumberField
            label="支払金額（副業の給与・2枚目の源泉徴収票）"
            badge="給与所得"
            value={value.sideSalaryRevenue}
            onChange={(sideSalaryRevenue) => patch({ sideSalaryRevenue })}
            hint="給与所得の副業がある場合のみ。なければ空欄"
            min={0}
            step={10000}
          />
        </div>
      </div>

      <div className="card-gold space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg text-cedar-950">事業所得（確定申告・給与以外）</h3>
          <p className="text-sm leading-7 text-cedar-900">
            源泉徴収票の支払金額とは別枠です。個人事業・フリーランスなど、確定申告する事業の売上と経費がある人だけ書いてください。給与だけの人は空欄のままです。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="売上（収入金額）"
            badge="確定申告"
            value={value.businessRevenue}
            onChange={(businessRevenue) => patch({ businessRevenue })}
            hint="確定申告書の事業収入。源泉徴収票の支払金額はここには入れません。"
            min={0}
            step={10000}
          />
          <NumberField
            label="必要経費"
            badge="確定申告"
            value={value.businessExpenses}
            onChange={(businessExpenses) => patch({ businessExpenses })}
            hint="事業にかかった経費。給与所得の控除ではありません。"
            min={0}
            step={10000}
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink-800">青色申告特別控除</span>
          <p className="text-xs leading-6 text-ink-500">事業所得がある人だけ。給与所得だけの人は未選択のままで構いません。</p>
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

      <div className="rounded-xl border border-ink-100 bg-white p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg text-ink-950">その他の所得（雑所得など・確定申告）</h3>
          <p className="text-sm leading-7 text-ink-600">
            源泉徴収票の給与とも、上の事業所得とも別です。原稿料・講演料・ネット販売など、確定申告する雑所得がある人だけ書いてください。
          </p>
        </div>
        <NumberField
          label="その他の所得（雑所得など）"
          badge="確定申告"
          value={value.otherIncome}
          onChange={(otherIncome) => patch({ otherIncome })}
          hint="給与所得・事業所得以外で申告する所得。なければ空欄"
          step={10000}
        />
      </div>
    </section>
  );
}
