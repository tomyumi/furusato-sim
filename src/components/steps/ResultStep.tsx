"use client";

import { useRef, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { FilingAlert } from "@/components/FilingAlert";
import { formatDeductionRatePercent } from "@/lib/calc/housingLoan";
import { formatPercent, formatYen } from "@/lib/format";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import type { BreakdownLine, CalculationResult } from "@/lib/types";

interface ResultStepProps {
  result: CalculationResult;
}

function BreakdownTable({ lines }: { lines: BreakdownLine[] }) {
  return (
    <ul className="divide-y divide-ink-100">
      {lines.map((line) => (
        <li
          key={line.label + String(line.amount) + (line.unit ?? "")}
          className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm"
        >
          <div>
            <div className="text-ink-800">{line.label}</div>
            {line.note ? <div className="text-xs text-ink-500">{line.note}</div> : null}
          </div>
          <div className="font-medium tabular-nums text-ink-900">
            {line.unit === "percent" ? formatPercent(line.amount) : formatYen(line.amount)}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ResultStep({ result }: ResultStepProps) {
  const captureRef = useRef<HTMLElement>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    if (typeof window === "undefined") return;
    const node = captureRef.current;
    if (!node) return;

    setError("");
    setBusy(true);
    setExpandAll(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      await downloadElementAsPdf(node, "furusato-nozei-result.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDFの作成に失敗しました。");
    } finally {
      setBusy(false);
      setExpandAll(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-2xl text-ink-900">シミュレーション結果</h2>
          <p className="text-sm text-ink-600">
            自己負担2,000円を除き、寄付金が全額控除される目安の上限です。
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="shrink-0 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-60"
        >
          {busy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
        </button>
      </header>
      {error ? <p className="text-sm text-cedar-800">{error}</p> : null}

      <article ref={captureRef} className="space-y-6 bg-white p-1">
        <FilingAlert result={result} />

        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-8 text-white shadow-soft">
          <p className="text-sm text-ink-200">ふるさと納税の控除上限額（目安）</p>
          <p className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            {formatYen(result.furusatoLimit)}
          </p>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            この金額までの寄付なら、実質負担はおよそ2,000円です。
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 px-3 py-2">
              <dt className="text-xs text-ink-400">総所得金額等</dt>
              <dd className="font-medium tabular-nums">{formatYen(result.totalIncome)}</dd>
            </div>
            <div className="rounded-2xl bg-white/5 px-3 py-2">
              <dt className="text-xs text-ink-400">住民税所得割</dt>
              <dd className="font-medium tabular-nums">{formatYen(result.residentTaxIncomeLevy)}</dd>
            </div>
            <div className="rounded-2xl bg-white/5 px-3 py-2">
              <dt className="text-xs text-ink-400">所得税の限界税率</dt>
              <dd className="font-medium tabular-nums">
                {formatPercent(result.marginalIncomeTaxRate)}
              </dd>
            </div>
          </dl>
        </div>

        {result.housingLoanPossibleAmount > 0 ? (
          <div className="rounded-2xl border border-ink-200 bg-white px-4 py-3">
            <h3 className="text-sm font-semibold text-ink-800">住宅ローン控除の振り分け</h3>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-600">控除率</dt>
                <dd className="tabular-nums">{formatDeductionRatePercent(result.housingLoanRate)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-600">控除可能額</dt>
                <dd className="tabular-nums">{formatYen(result.housingLoanPossibleAmount)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-600">所得税から使い切り</dt>
                <dd className="tabular-nums">{formatYen(result.housingLoanUsedOnIncomeTax)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-600">所得税の残り（復興特別所得税込）</dt>
                <dd className="tabular-nums">{formatYen(result.incomeTaxAfterCredits)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-600">翌年の住民税へ振替</dt>
                <dd className="tabular-nums">{formatYen(result.housingLoanResidentTaxCredit)}</dd>
              </div>
              <div className="flex justify-between gap-2 sm:col-span-2">
                <dt className="text-ink-600">上限超過で控除できない額</dt>
                <dd className="tabular-nums">{formatYen(result.housingLoanUnusedCredit)}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {result.notices.length > 0 ? (
          <div className="space-y-2 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
            <h3 className="text-sm font-semibold text-ink-800">計算上の補足</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-700">
              {result.notices.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-ink-800">計算根拠の内訳</h3>
          <Accordion title="所得の内訳" defaultOpen forceOpen={expandAll}>
            <BreakdownTable lines={result.breakdown.income} />
          </Accordion>
          <Accordion title="所得控除（所得税ベース）" forceOpen={expandAll}>
            <BreakdownTable lines={result.breakdown.deductions} />
          </Accordion>
          <Accordion title="税額・住宅ローン・住民税所得割" forceOpen={expandAll}>
            <BreakdownTable lines={result.breakdown.tax} />
          </Accordion>
          <Accordion title="ふるさと納税上限の算出" forceOpen={expandAll}>
            <BreakdownTable lines={result.breakdown.furusato} />
            <p className="mt-3 text-xs text-ink-500">
              算式の目安:（住民税所得割 × 20%）÷（90% − 所得税限界税率 × 1.021）+ 2,000円
            </p>
          </Accordion>
        </div>

        <p className="text-xs leading-relaxed text-ink-500">
          本ツールは税制を簡易モデル化した目安計算です。最終判断は税務署または税理士等へご確認ください。
        </p>
      </article>

      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="w-full rounded-full border border-ink-300 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-50 disabled:opacity-60 sm:w-auto"
      >
        {busy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
      </button>
    </section>
  );
}
