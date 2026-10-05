"use client";

import { formatInputAmount, formatInputYear, formatPercent, formatYen } from "@/lib/format";
import { formatSavedAt, MAX_HISTORY, type HistoryEntry } from "@/lib/storage";
import type { CalculationResult } from "@/lib/types";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  current?: Pick<
    CalculationResult,
    "furusatoLimit" | "totalIncome" | "residentTaxIncomeLevy" | "marginalIncomeTaxRate"
  >;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  entries,
  current,
  selectedIds,
  onToggleSelect,
  onRestore,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const compareEntries = entries.filter((e) => selectedIds.includes(e.id)).slice(0, MAX_HISTORY);

  return (
    <section
      data-pdf-hide
      className="card"
      aria-label="シミュレーション履歴"
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg text-ink-950">過去のシミュレーション</h2>
          <p className="section-copy mt-1">
            結果を開くと自動で保存されます。最大3件まで残り、選んで今回の結果と比較できます。
          </p>
          <p className="field-hint mt-2">
            ※プライバシー保護のため、入力データおよび履歴はサーバーに送信されず、すべてお客様のブラウザ内で完結します。
          </p>
        </div>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="btn-ghost px-3 py-2 text-xs"
          >
            履歴を消去
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="section-copy mt-2">まだ履歴はありません。</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {entries.map((entry) => {
            const checked = selectedIds.includes(entry.id);
            return (
              <li
                key={entry.id}
                className="min-w-0 rounded-md border border-ink-100 bg-ink-50/80 px-4 py-3"
              >
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                  <label className="flex min-w-0 cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 shrink-0"
                      checked={checked}
                      onChange={() => onToggleSelect(entry.id)}
                    />
                    <span className="min-w-0">
                      <span className="block font-medium leading-6 text-ink-900">
                        上限 {formatYen(entry.snapshot.furusatoLimit)}
                      </span>
                      <span className="field-hint block">
                        {formatSavedAt(entry.savedAt)}
                        {" ・ "}
                        対象年 {formatInputYear(entry.snapshot.taxYear)}
                        {" ・ "}
                        支払金額 {formatInputAmount(entry.snapshot.primarySalaryRevenue)}
                      </span>
                    </span>
                  </label>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => onRestore(entry)}
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      復元
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="btn-ghost px-3 py-1.5 text-xs"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {current && compareEntries.length > 0 ? (
        <div className="mt-3 overflow-x-auto">
          <p className="mb-2 text-xs font-medium leading-6 text-ink-700">比較</p>
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs text-ink-700">
                <th className="py-2 pr-3 font-medium">項目</th>
                <th className="py-2 pr-3 font-medium">今回</th>
                {compareEntries.map((entry, i) => (
                  <th key={entry.id} className="py-2 pr-3 font-medium">
                    履歴{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-100">
                <td className="py-2 pr-3 text-ink-700">保存日時</td>
                <td className="py-2 pr-3">—</td>
                {compareEntries.map((e) => (
                  <td key={e.id} className="py-2 pr-3">
                    {formatSavedAt(e.savedAt)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-2 pr-3 text-ink-700">控除上限額</td>
                <td className="py-2 pr-3 font-medium tabular-nums">
                  {formatYen(current.furusatoLimit)}
                </td>
                {compareEntries.map((e) => (
                  <td key={e.id} className="py-2 pr-3 font-medium tabular-nums">
                    {formatYen(e.snapshot.furusatoLimit)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-2 pr-3 text-ink-700">総所得金額等</td>
                <td className="py-2 pr-3 tabular-nums">{formatYen(current.totalIncome)}</td>
                {compareEntries.map((e) => (
                  <td key={e.id} className="py-2 pr-3 tabular-nums">
                    {formatYen(e.snapshot.totalIncome)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-2 pr-3 text-ink-700">住民税所得割</td>
                <td className="py-2 pr-3 tabular-nums">
                  {formatYen(current.residentTaxIncomeLevy)}
                </td>
                {compareEntries.map((e) => (
                  <td key={e.id} className="py-2 pr-3 tabular-nums">
                    {formatYen(e.snapshot.residentTaxIncomeLevy)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-3 text-ink-700">所得税の限界税率</td>
                <td className="py-2 pr-3 tabular-nums">
                  {formatPercent(current.marginalIncomeTaxRate)}
                </td>
                {compareEntries.map((e) => (
                  <td key={e.id} className="py-2 pr-3 tabular-nums">
                    {formatPercent(e.snapshot.marginalIncomeTaxRate)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
