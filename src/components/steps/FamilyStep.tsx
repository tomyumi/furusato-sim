"use client";

import { NumberField } from "@/components/ui/NumberField";
import { formatYen } from "@/lib/format";
import { toAmount } from "@/lib/numbers";
import type { FamilyInput, HousingLoanRateChoice, SpouseStatus } from "@/lib/types";

interface FamilyStepProps {
  value: FamilyInput;
  onChange: (next: FamilyInput) => void;
}

export function FamilyStep({ value, onChange }: FamilyStepProps) {
  const patch = (partial: Partial<FamilyInput>) => onChange({ ...value, ...partial });
  const rate = value.housingLoanRate === "" ? 0 : value.housingLoanRate;
  const balance = toAmount(value.housingLoanYearEndBalance);
  const fromBalance = balance > 0 && rate > 0 ? Math.trunc(balance * rate) : 0;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h3 className="font-display text-2xl text-ink-950">家族と住宅ローン</h3>
        <p className="text-sm leading-7 text-ink-600">
          人数や金額は空欄のままでも構いません。未入力は0として計算します。
        </p>
      </header>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-ink-800">控除対象配偶者</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {(
            [
              ["none", "いない"],
              ["deduction", "配偶者控除あり"],
              ["special", "配偶者特別控除あり"],
            ] as [SpouseStatus, string][]
          ).map(([id, label]) => (
            <label
              key={id}
              className={`choice-chip ${
                value.spouseStatus === id
                  ? "border-cedar-400 bg-cedar-50 text-ink-900"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name="spouse"
                className="mt-1 shrink-0"
                checked={value.spouseStatus === id}
                onChange={() => patch({ spouseStatus: id })}
              />
              <span className="min-w-0 break-words">{label}</span>
            </label>
          ))}
        </div>
        {value.spouseStatus !== "none" ? (
          <NumberField
            label="配偶者の合計所得金額"
            value={value.spouseIncome}
            onChange={(spouseIncome) => patch({ spouseIncome })}
            min={0}
            step={10000}
          />
        ) : null}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="一般の控除対象扶養親族（16歳以上）"
          value={value.dependentGeneral}
          onChange={(dependentGeneral) => patch({ dependentGeneral })}
          suffix="人"
          min={0}
          max={20}
        />
        <NumberField
          label="特定扶養親族（19〜22歳）"
          value={value.dependentSpecific}
          onChange={(dependentSpecific) => patch({ dependentSpecific })}
          suffix="人"
          min={0}
          max={20}
        />
        <NumberField
          label="老人扶養親族（同居以外）"
          value={value.dependentElderly}
          onChange={(dependentElderly) => patch({ dependentElderly })}
          suffix="人"
          min={0}
          max={20}
        />
        <NumberField
          label="老人扶養親族（同居）"
          value={value.dependentElderlyLiving}
          onChange={(dependentElderlyLiving) => patch({ dependentElderlyLiving })}
          suffix="人"
          min={0}
          max={20}
        />
      </div>

      <div className="card-muted space-y-4">
        <label className="flex items-start gap-3 text-sm font-medium leading-6 text-ink-800">
          <input
            type="checkbox"
            checked={value.hasHousingLoanCredit}
            onChange={(e) => patch({ hasHousingLoanCredit: e.target.checked })}
            className="mt-1 h-4 w-4 shrink-0 rounded border-ink-300"
          />
          <span className="min-w-0 break-words">住宅借入金等特別控除（住宅ローン控除）あり</span>
        </label>

        {value.hasHousingLoanCredit ? (
          <div className="space-y-3">
            <NumberField
              label="居住開始年"
              value={value.occupancyYear}
              onChange={(occupancyYear) => patch({ occupancyYear })}
              hint="住み始めた西暦。例: 2020。1ページ目の対象年と同じ欄でも構いません。"
              suffix="年"
              min={1990}
              max={2100}
            />

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink-800">控除率</span>
              <select
                className="field-select"
                value={value.housingLoanRate === "" ? "" : String(value.housingLoanRate)}
                onChange={(e) =>
                  patch({
                    housingLoanRate:
                      e.target.value === ""
                        ? ""
                        : (Number(e.target.value) as HousingLoanRateChoice),
                  })
                }
              >
                <option value="">未選択</option>
                <option value="0.01">1.0%（2021年以前に入居した方向け）</option>
                <option value="0.007">0.7%（2022年以降に入居した方向け）</option>
              </select>
              <span className="block text-xs text-ink-500">
                ご自身の入居時期に合う率を選んでください。未選択のときは年末残高からの計算はしません。
              </span>
            </label>

            <NumberField
              label="住宅借入金等年末残高"
              badge="源泉徴収票"
              value={value.housingLoanYearEndBalance}
              onChange={(housingLoanYearEndBalance) => patch({ housingLoanYearEndBalance })}
              hint="源泉徴収票の摘要欄「住宅借入金等年末残高」。"
              min={0}
              step={10000}
            />

            {fromBalance > 0 ? (
              <p className="text-xs text-ink-600">
                年末残高 × {(rate * 100).toFixed(1)}% ＝{" "}
                <span className="font-medium tabular-nums">{formatYen(fromBalance)}</span>
              </p>
            ) : null}

            <NumberField
              label="住宅借入金等特別控除可能額"
              badge="源泉徴収票"
              value={value.housingLoanPossibleAmount}
              onChange={(housingLoanPossibleAmount) => patch({ housingLoanPossibleAmount })}
              hint="源泉徴収票に書いてあれば優先して使います。空欄なら上の残高×控除率です。"
              min={0}
              step={1000}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
