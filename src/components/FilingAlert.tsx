"use client";

import type { CalculationResult } from "@/lib/types";

export function FilingAlert({ result }: { result: CalculationResult }) {
  if (result.filingCanUseOneStop) {
    return (
      <div className="rounded-2xl border border-mist-200 bg-mist-50 px-4 py-3 text-sm text-mist-950">
        <p className="font-semibold">ワンストップ特例を使える可能性があります</p>
        <p className="mt-1 text-mist-900/90">
          給与が1か所のみで、医療費控除や住宅ローン控除の初年度など確定申告が必要な事情がない入力です。寄付先が5自治体以内なら、ワンストップ特例を検討できます。
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-cedar-400 bg-cedar-50 px-4 py-3 text-sm text-cedar-950"
    >
      <p className="font-semibold">ワンストップ特例は使えません。確定申告が必要です。</p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        {result.filingReasons.map((r) => (
          <li key={r.id}>
            <span className="font-medium">{r.title}</span>
            <span className="block text-cedar-900/90">{r.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
