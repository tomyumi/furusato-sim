"use client";

import { useRef, useState, type ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { FilingAdvisor } from "@/components/FilingAdvisor";
import { GiftCart } from "@/components/GiftCart";
import { InputSummary } from "@/components/steps/InputSummary";
import { formatDeductionRatePercent } from "@/lib/calc/housingLoan";
import { formatPercent, formatYen } from "@/lib/format";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import type { BreakdownLine, CalculationResult, SimulatorFormState } from "@/lib/types";

interface ResultStepProps {
  result: CalculationResult;
  form: SimulatorFormState;
  history?: ReactNode;
  resultAnchorId?: string;
}

function BreakdownTable({ lines }: { lines: BreakdownLine[] }) {
  return (
    <div>
      {lines.map((line) => (
        <div
          key={line.label + String(line.amount) + (line.unit ?? "")}
          data-pdf-unit
          className="border-b border-ink-100 py-3 last:border-b-0"
        >
          <div className="text-sm leading-6 text-ink-800">{line.label}</div>
          {line.note ? (
            <div className="mt-0.5 text-xs leading-5 text-ink-500">{line.note}</div>
          ) : null}
          <div className="mt-1 text-right text-base font-semibold leading-7 tabular-nums text-ink-950">
            {line.unit === "percent" ? formatPercent(line.amount) : formatYen(line.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResultStep({ result, form, history, resultAnchorId = "simulator-result-limit" }: ResultStepProps) {
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
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve(undefined)));
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      await downloadElementAsPdf(node, "furusato-nozei-result.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDFの作成に失敗しました。");
    } finally {
      setBusy(false);
      setExpandAll(false);
    }
  }

  return (
    <section className="min-w-0 space-y-8">
      <header className="min-w-0 space-y-2">
        <h3 className="font-display text-2xl text-ink-950 sm:text-3xl">控除上限額のシミュレーション結果</h3>
        <p className="text-sm leading-7 text-ink-600">
          自己負担2,000円を除き、ふるさと納税をいくらまで寄付できるかの限度額（目安）です。
        </p>
      </header>

      <article ref={captureRef} className="min-w-0 space-y-8 overflow-visible bg-white">
        <div
          id={resultAnchorId}
          data-pdf-block
          className="min-w-0 scroll-mt-24 overflow-visible rounded-xl bg-ink-950 px-6 py-7 text-white outline-none sm:px-8"
          tabIndex={-1}
        >
          <p className="kicker text-cedar-300">RESULT</p>
          <p className="mt-3 text-sm leading-7 text-ink-300">ふるさと納税の控除上限額（目安）</p>
          <p className="amount-figure mt-2 text-4xl text-white sm:text-5xl">
            {formatYen(result.furusatoLimit)}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-300">
            この金額までの寄付なら、実質負担はおよそ2,000円です。
          </p>
        </div>

        <GiftCart limit={result.furusatoLimit} />

        {history}

        <div className="space-y-6">
          <h3 data-pdf-block className="font-display text-lg text-ink-950">
            今回の控除上限額のシミュレーション結果詳細
          </h3>

          {result.housingLoanPossibleAmount > 0 ? (
            <div data-pdf-block className="card-gold">
              <h3 className="text-sm font-semibold leading-6 text-ink-800">住宅ローン控除の振り分け</h3>
              <dl className="mt-1">
                <div className="kv-row">
                  <div className="kv-label text-ink-600">控除率</div>
                  <div className="kv-value">{formatDeductionRatePercent(result.housingLoanRate)}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-label text-ink-600">控除可能額</div>
                  <div className="kv-value">{formatYen(result.housingLoanPossibleAmount)}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-label text-ink-600">所得税から使い切り</div>
                  <div className="kv-value">{formatYen(result.housingLoanUsedOnIncomeTax)}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-label text-ink-600">所得税の残り（復興特別所得税込）</div>
                  <div className="kv-value">{formatYen(result.incomeTaxAfterCredits)}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-label text-ink-600">翌年の住民税へ振替</div>
                  <div className="kv-value">{formatYen(result.housingLoanResidentTaxCredit)}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-label text-ink-600">上限超過で控除できない額</div>
                  <div className="kv-value">{formatYen(result.housingLoanUnusedCredit)}</div>
                </div>
              </dl>
            </div>
          ) : null}

          {result.notices.length > 0 ? (
            <div data-pdf-block className="card-muted">
              <h3 className="text-sm font-semibold leading-6 text-ink-800">計算上の補足</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-700">
                {result.notices.map((n) => (
                  <li key={n} className="min-w-0 break-words">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl data-pdf-block className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card-gold">
              <dt className="text-xs tracking-wide text-cedar-800">総所得金額等</dt>
              <dd className="amount-figure mt-2 text-xl text-cedar-950">{formatYen(result.totalIncome)}</dd>
            </div>
            <div className="card-gold">
              <dt className="text-xs tracking-wide text-cedar-800">住民税所得割</dt>
              <dd className="amount-figure mt-2 text-xl text-cedar-950">
                {formatYen(result.residentTaxIncomeLevy)}
              </dd>
            </div>
            <div className="card-gold">
              <dt className="text-xs tracking-wide text-cedar-800">所得税の限界税率</dt>
              <dd className="amount-figure mt-2 text-xl text-cedar-950">
                {formatPercent(result.marginalIncomeTaxRate)}
              </dd>
            </div>
          </dl>

          <div className="space-y-3">
            <h3 data-pdf-block className="font-display text-lg text-ink-950">
              計算内訳
            </h3>
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
              <p className="mt-2 text-xs leading-6 text-cedar-800">
                算式の目安:（住民税所得割 × 20%）÷（90% − 所得税限界税率 × 1.021）+ 2,000円
              </p>
            </Accordion>
          </div>

          <InputSummary form={form} />
        </div>

        <FilingAdvisor form={form} />

        <p data-pdf-block className="min-w-0 text-xs leading-6 text-ink-500">
          本ツールは税制を簡易モデル化した目安計算です。最終判断は税務署または税理士等へご確認ください。
        </p>
      </article>

      <div data-pdf-hide className="flex min-w-0 flex-col gap-3">
        {error ? <p className="text-sm font-medium text-cedar-800">{error}</p> : null}
        <button type="button" onClick={handleDownload} disabled={busy} className="btn-primary sm:self-start">
          {busy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
        </button>
      </div>
    </section>
  );
}
