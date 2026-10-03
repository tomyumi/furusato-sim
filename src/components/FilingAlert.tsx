"use client";

import type { CalculationResult } from "@/lib/types";

export function FilingAlert({ result }: { result: CalculationResult }) {
  if (result.filingCanUseOneStop) {
    return (
      <div className="min-w-0 overflow-visible rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-3 text-sm leading-6 text-mist-950">
        <p className="font-semibold leading-6">ワンストップ特例を使える可能性があります</p>
        <p className="mt-1 break-words text-mist-900/90">
          給与が1か所のみで、医療費控除や住宅ローン控除の初年度など確定申告が必要な事情がない入力です。寄付先が5自治体以内なら、ワンストップ特例を検討できます。
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="min-w-0 overflow-visible rounded-xl border border-cedar-400 bg-cedar-50 px-3.5 py-3 text-sm leading-6 text-cedar-950"
    >
      <p className="font-semibold leading-6">ワンストップ特例は使えません。確定申告が必要です。</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {result.filingReasons.map((r) => (
          <li key={r.id} className="min-w-0">
            <span className="block font-medium leading-6">{r.title}</span>
            <span className="mt-1 block break-words text-cedar-900/90">{r.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
