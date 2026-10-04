"use client";

import { useEffect, useMemo, useState } from "react";
import { FilingAlert } from "@/components/FilingAlert";
import { HistoryPanel } from "@/components/HistoryPanel";
import { DeductionsStep } from "@/components/steps/DeductionsStep";
import { FamilyStep } from "@/components/steps/FamilyStep";
import { IncomeStep } from "@/components/steps/IncomeStep";
import { ResultStep } from "@/components/steps/ResultStep";
import { StepNav } from "@/components/ui/StepNav";
import { calculateFurusatoLimit } from "@/lib/calc";
import { toAmount } from "@/lib/numbers";
import {
  clearHistory,
  deleteHistoryEntry,
  loadDraft,
  loadHistory,
  recordHistory,
  saveDraft,
  type HistoryEntry,
} from "@/lib/storage";
import { defaultFormState, type SimulatorFormState } from "@/lib/types";

const STEPS = ["源泉徴収票（給与）", "控除の金額", "家族・住宅ローン", "結果"] as const;

export function Simulator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SimulatorFormState>(() => defaultFormState());
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const result = useMemo(() => calculateFurusatoLimit(form), [form]);
  const estimatedSocial = Math.floor(
    (toAmount(form.income.primarySalaryRevenue) + toAmount(form.income.sideSalaryRevenue)) *
      0.15,
  );

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setForm(draft);
    const items = loadHistory();
    setHistory(items);
    setSelectedIds(items.slice(0, 1).map((item) => item.id));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft(form);
  }, [form, ready]);

  function openResult() {
    const items = recordHistory(form, result);
    setHistory(items);
    setSelectedIds((ids) => {
      const keep = ids.filter((id) => items.some((item) => item.id === id)).slice(0, 2);
      if (keep.length > 0) return keep;
      return items.slice(0, 1).map((item) => item.id);
    });
    setStep(3);
  }

  function goToStep(index: number) {
    if (index === 3) {
      openResult();
      return;
    }
    setStep(index);
  }

  function restoreEntry(entry: HistoryEntry) {
    setForm(entry.form);
    setStep(0);
  }

  function toggleSelect(id: string) {
    setSelectedIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id);
      return [...ids, id].slice(-2);
    });
  }

  function removeEntry(id: string) {
    const items = deleteHistoryEntry(id);
    setHistory(items);
    setSelectedIds((ids) => ids.filter((x) => x !== id));
  }

  function wipeHistory() {
    setHistory(clearHistory());
    setSelectedIds([]);
  }

  const historyPanel = (
    <HistoryPanel
      entries={ready ? history : []}
      current={ready && step === 3 ? result : undefined}
      selectedIds={ready ? selectedIds : []}
      onToggleSelect={toggleSelect}
      onRestore={restoreEntry}
      onDelete={removeEntry}
      onClear={wipeHistory}
    />
  );

  return (
    <div className="w-full min-w-0 space-y-8">
      {historyPanel}

      <section id="simulator" className="min-w-0 scroll-mt-24 space-y-4" aria-labelledby="limit-sim-heading">
        <div className="min-w-0 space-y-2">
          <h2 id="limit-sim-heading" className="font-display text-2xl text-ink-950 sm:text-3xl">
            控除上限額・限度額を計算する
          </h2>
          <p className="text-sm leading-7 text-ink-600">
            年収の早見表ではなく、源泉徴収票の金額から「ふるさと納税はいくらまで」寄付できるかをシミュレーションします。
          </p>
        </div>

      <StepNav steps={[...STEPS]} current={step} onSelect={goToStep} />

      <div className="card">
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
        {step === 3 ? <ResultStep result={result} form={form} /> : null}

        {step === 3 ? <div className="mt-8">{historyPanel}</div> : null}

        {step < 3 && result.filingNeedsTaxReturn ? (
          <div className="mt-8">
            <FilingAlert result={result} />
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-ghost"
          >
            戻る
          </button>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {!isLast ? (
              <button
                type="button"
                onClick={() => goToStep(Math.min(STEPS.length - 1, step + 1))}
                className="btn-secondary"
              >
                次へ
              </button>
            ) : (
              <button type="button" onClick={() => setStep(0)} className="btn-secondary">
                入力を見直す
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={openResult} className="btn-accent">
                結果を見る
              </button>
            ) : null}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
