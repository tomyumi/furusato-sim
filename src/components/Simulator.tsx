"use client";

import { useMemo, useState } from "react";
import { FilingAlert } from "@/components/FilingAlert";
import { DeductionsStep } from "@/components/steps/DeductionsStep";
import { FamilyStep } from "@/components/steps/FamilyStep";
import { IncomeStep } from "@/components/steps/IncomeStep";
import { ResultStep } from "@/components/steps/ResultStep";
import { StepNav } from "@/components/ui/StepNav";
import { calculateFurusatoLimit } from "@/lib/calc";
import { toAmount } from "@/lib/numbers";
import { defaultFormState, type SimulatorFormState } from "@/lib/types";

const STEPS = ["源泉徴収票（給与）", "控除の金額", "家族・住宅ローン", "結果"] as const;

export function Simulator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SimulatorFormState>(() => defaultFormState());

  const result = useMemo(() => calculateFurusatoLimit(form), [form]);
  const estimatedSocial = Math.floor(
    (toAmount(form.income.primarySalaryRevenue) + toAmount(form.income.sideSalaryRevenue)) *
      0.15,
  );

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <StepNav steps={[...STEPS]} current={step} onSelect={setStep} />

      <div className="rounded-3xl border border-ink-200/80 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-8">
        {step === 0 ? (
          <IncomeStep
            value={form.income}
            taxYear={form.taxYear}
            occupancyYear={form.family.occupancyYear}
            onChange={(income) => setForm((f) => ({ ...f, income }))}
            onTaxYearChange={(taxYear) => setForm((f) => ({ ...f, taxYear }))}
            onOccupancyYearChange={(occupancyYear) =>
              setForm((f) => ({
                ...f,
                family: { ...f.family, occupancyYear },
              }))
            }
          />
        ) : null}
        {step === 1 ? (
          <DeductionsStep
            value={form.deductions}
            onChange={(deductions) => setForm((f) => ({ ...f, deductions }))}
            estimatedSocialInsurance={estimatedSocial}
          />
        ) : null}
        {step === 2 ? (
          <FamilyStep
            value={form.family}
            onChange={(family) => setForm((f) => ({ ...f, family }))}
          />
        ) : null}
        {step === 3 ? <ResultStep result={result} /> : null}

        {step < 3 && result.filingNeedsTaxReturn ? (
          <div className="mt-6">
            <FilingAlert result={result} />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            戻る
          </button>
          <div className="flex items-center gap-2">
            {!isLast ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800"
              >
                次へ
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="rounded-full border border-ink-300 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-50"
              >
                入力を見直す
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full bg-mist-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-mist-700"
              >
                結果を見る
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
