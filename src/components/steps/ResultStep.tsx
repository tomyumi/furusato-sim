"use client";

import { useRef, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { FilingAlert } from "@/components/FilingAlert";
import { SiteLinks } from "@/components/SiteLinks";
import { InputSummary } from "@/components/steps/InputSummary";
import { formatDeductionRatePercent } from "@/lib/calc/housingLoan";
import { formatPercent, formatYen } from "@/lib/format";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import type { BreakdownLine, CalculationResult, SimulatorFormState } from "@/lib/types";

interface ResultStepProps {
  result: CalculationResult;
  form: SimulatorFormState;
}

function BreakdownTable({ lines }: { lines: BreakdownLine[] }) {
  return (
    <div>
      {lines.map((line) => (
        <div
          key={line.label + String(line.amount) + (line.unit ?? "")}
          data-pdf-unit
          className="border-b border-ink-100 py-2.5 last:border-b-0"
        >
          <div className="text-sm leading-6 text-ink-800">{line.label}</div>
          {line.note ? (
            <div className="mt-0.5 text-xs leading-5 text-ink-500">{line.note}</div>
          ) : null}
          <div className="mt-0.5 text-right text-sm font-medium leading-6 tabular-nums text-ink-900">
            {line.unit === "percent" ? formatPercent(line.amount) : formatYen(line.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResultStep({ result, form }: ResultStepProps) {
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
    <section className="min-w-0 space-y-4">
      <header className="flex min-w-0 flex-col gap-3">
        <div className="min-w-0 space-y-1">
          <h2 className="text-2xl font-semibold leading-normal text-ink-900">
            {"シミュレーション結果"}
          </h2>
          <p className="text-sm leading-6 text-ink-600">
            自己負担2,000円を除き、寄付金が全額控除される目安の上限です。
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="w-full rounded-full bg-ink-900 px-5 py-2 text-sm font-medium leading-5 text-white transition hover:bg-ink-800 disabled:opacity-60 sm:w-auto sm:self-start"
        >
          {busy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
        </button>
      </header>
      {error ? <p className="text-sm text-cedar-800">{error}</p> : null}

      <article ref={captureRef} className="min-w-0 space-y-3 overflow-visible bg-white">
        <div data-pdf-block className="min-w-0">
          <h2 className="text-xl font-semibold leading-normal text-ink-900">
            {"ふるさと納税 控除上限シミュレーション"}
          </h2>
        </div>

        <div data-pdf-block>
          <FilingAlert result={result} />
        </div>

        <div
          data-pdf-block
          className="min-w-0 overflow-visible rounded-2xl bg-ink-950 px-4 py-4 text-white sm:px-5"
        >
          <p className="text-xs font-medium tracking-[0.18em] text-mist-300">RESULT</p>
          <p className="mt-1.5 text-sm leading-6 text-ink-200">ふるさと納税の控除上限額（目安）</p>
          <p className="mt-2 break-words text-3xl font-semibold leading-normal sm:text-4xl">
            {formatYen(result.furusatoLimit)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-300">
            この金額までの寄付なら、実質負担はおよそ2,000円です。
          </p>
        </div>

        <SiteLinks />

        {result.housingLoanPossibleAmount > 0 ? (
          <div
            data-pdf-block
            className="min-w-0 overflow-visible rounded-xl border border-ink-200 bg-white px-3.5 py-3"
          >
            <h3 className="text-sm font-semibold leading-6 text-ink-800">
              住宅ローン控除の振り分け
            </h3>
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
          <div
            data-pdf-block
            className="min-w-0 overflow-visible rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-3"
          >
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

        <dl data-pdf-block className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="min-w-0 overflow-visible rounded-xl border border-cedar-300 bg-[#fbf8f3] px-3.5 py-3">
            <dt className="text-xs leading-5 text-cedar-800">総所得金額等</dt>
            <dd className="mt-1 break-words font-medium leading-6 tabular-nums text-cedar-950">
              {formatYen(result.totalIncome)}
            </dd>
          </div>
          <div className="min-w-0 overflow-visible rounded-xl border border-cedar-300 bg-[#fbf8f3] px-3.5 py-3">
            <dt className="text-xs leading-5 text-cedar-800">住民税所得割</dt>
            <dd className="mt-1 break-words font-medium leading-6 tabular-nums text-cedar-950">
              {formatYen(result.residentTaxIncomeLevy)}
            </dd>
          </div>
          <div className="min-w-0 overflow-visible rounded-xl border border-cedar-300 bg-[#fbf8f3] px-3.5 py-3">
            <dt className="text-xs leading-5 text-cedar-800">所得税の限界税率</dt>
            <dd className="mt-1 break-words font-medium leading-6 tabular-nums text-cedar-950">
              {formatPercent(result.marginalIncomeTaxRate)}
            </dd>
          </div>
        </dl>

        <div className="space-y-2">
          <h3
            data-pdf-block
            className="text-sm font-semibold leading-6 text-ink-800"
          >
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

        <p data-pdf-block className="min-w-0 text-xs leading-6 text-ink-500">
          本ツールは税制を簡易モデル化した目安計算です。最終判断は税務署または税理士等へご確認ください。
        </p>
      </article>

      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="w-full rounded-full border border-ink-300 bg-white px-5 py-2 text-sm font-medium leading-5 text-ink-800 transition hover:bg-ink-50 disabled:opacity-60 sm:w-auto"
      >
        {busy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
      </button>
    </section>
  );
}
