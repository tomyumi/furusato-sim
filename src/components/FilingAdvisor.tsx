"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adviseFiling,
  defaultFilingAdvisorAnswers,
  type FilingAdvisorAnswers,
  type FilingCheck,
  type FilingVerdict,
  type TriState,
} from "@/lib/calc/filing";
import { loadFilingAdvisorAnswers, saveFilingAdvisorAnswers } from "@/lib/storage";
import { normalizeForm, type SimulatorFormState } from "@/lib/types";
import { useClientReady } from "@/lib/useClientReady";

interface FilingAdvisorProps {
  form: SimulatorFormState;
}

const QUESTION_OPTIONS: { value: TriState; label: string }[] = [
  { value: "yes", label: "はい" },
  { value: "no", label: "いいえ" },
];

function statusMark(status: FilingCheck["status"]) {
  if (status === "pass") return "○";
  if (status === "fail") return "×";
  return "？";
}

function bannerClass(verdict: FilingVerdict) {
  if (verdict === "oneStop") {
    return "border-mist-400 bg-mist-50 text-mist-950";
  }
  if (verdict === "taxReturn") {
    return "border-cedar-400 bg-cedar-50 text-cedar-950";
  }
  return "border-ink-300 bg-ink-50 text-ink-950";
}

function ChoiceRow({
  name,
  question,
  hint,
  value,
  onChange,
}: {
  name: string;
  question: string;
  hint: string;
  value: TriState;
  onChange: (next: TriState) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="field-label">{question}</legend>
      <p className="field-hint">{hint}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {QUESTION_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`choice-chip ${
                selected
                  ? "border-cedar-400 bg-cedar-50 text-ink-900"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                className="mt-1 shrink-0"
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilingAdvisor({ form }: FilingAdvisorProps) {
  const mounted = useClientReady();
  const [answers, setAnswers] = useState<FilingAdvisorAnswers>(defaultFilingAdvisorAnswers);
  const [storageReady, setStorageReady] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!mounted) return;
    setAnswers(loadFilingAdvisorAnswers());
    setNow(new Date());
    setStorageReady(true);
  }, [mounted]);

  useEffect(() => {
    if (!storageReady) return;
    saveFilingAdvisorAnswers(answers);
  }, [answers, storageReady]);

  const advice = useMemo(
    () => adviseFiling(normalizeForm(form), answers, now ?? undefined),
    [form, answers, now],
  );

  const patch = (partial: Partial<FilingAdvisorAnswers>) =>
    setAnswers((current) => ({ ...current, ...partial }));

  const highlightOneStop = advice.verdict === "oneStop" || advice.verdict === "checkAnswers";

  if (!mounted || !storageReady) {
    return (
      <section className="min-w-0 space-y-5" aria-labelledby="filing-advisor-heading">
        <div className="card">
          <p id="filing-advisor-heading" className="font-display text-lg text-ink-950">
            かんたん確認（2問）
          </p>
          <p className="section-copy mt-2">読み込み中…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 space-y-5" aria-labelledby="filing-advisor-heading">
      <div data-pdf-hide className="card">
        <p className="font-display text-lg text-ink-950">かんたん確認（2問）</p>
        <p className="section-copy mt-2">
          シミュレーションの入力に加えて、手続きの分かれ目になる点だけ聞きます。回答はこのブラウザに保存されます。
        </p>
        <div className="mt-6 space-y-6">
          <ChoiceRow
            name="plansOtherReturn"
            question="もともと確定申告や医療費控除・住宅ローン控除を行う予定がありますか？"
            hint="申告するとワンストップ特例は無効になります。2年目以降の住宅ローン控除で年末調整だけなら「いいえ」です。"
            value={answers.plansOtherReturn}
            onChange={(plansOtherReturn) => patch({ plansOtherReturn })}
          />
          <ChoiceRow
            name="municipalitiesWithinFive"
            question="1年の寄付先自治体数は5自治所以内ですか？"
            hint="同じ自治体への複数回は1つと数えます。6以上なら確定申告が必要です。"
            value={answers.municipalitiesWithinFive}
            onChange={(municipalitiesWithinFive) => patch({ municipalitiesWithinFive })}
          />
        </div>
      </div>

      <div data-pdf-block className={`min-w-0 overflow-visible rounded-xl border px-6 py-6 ${bannerClass(advice.verdict)}`}>
        <p className="kicker opacity-80">ADVISOR</p>
        <h3 id="filing-advisor-heading" className="mt-2 font-display text-xl leading-snug">
          {advice.headline}
        </h3>
        <p className="mt-2 text-sm leading-7 opacity-90">{advice.subhead}</p>
      </div>

      <div data-pdf-block className="card">
        <p className="font-display text-lg text-ink-950">判定の根拠</p>
        <ul className="mt-4 space-y-3">
          {advice.checks.map((check) => (
            <li
              key={check.id}
              className="min-w-0 rounded-lg border border-ink-100 bg-ink-50/80 px-3 py-3 text-sm leading-7"
            >
              <p className="font-medium text-ink-900">
                <span className="mr-2 tabular-nums">{statusMark(check.status)}</span>
                {check.label}
              </p>
              <p className="field-hint mt-1">{check.note}</p>
            </li>
          ))}
        </ul>
        {advice.allReasons.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-8 text-ink-800">
            {advice.allReasons.map((reason) => (
              <li key={reason.id} className="min-w-0">
                <span className="font-medium">{reason.title}</span>
                <span className="mt-0.5 block break-words text-ink-700">{reason.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ProcedureCard
          title="ワンストップ特例"
          emphasized={highlightOneStop && advice.verdict !== "taxReturn"}
          muted={advice.verdict === "taxReturn"}
          steps={[
            "寄付のときに申請書の送付を依頼するか、自治体サイトから用紙を入手します。",
            "マイナンバーと本人確認書類のコピーを添えて、寄付した各自治体へ提出します。",
            `提出期限は ${advice.deadlines.oneStop} です。間に合わなければ確定申告に切り替えます。`,
          ]}
          notes={[
            "申請は自治体ごとに必要です。5自治体内が条件です。",
            "翌年6月以降の住民税から控除されます（所得税の還付はありません）。",
            "あとから確定申告をすると、出した申請は無効になります。",
          ]}
        />
        <ProcedureCard
          title="確定申告"
          emphasized={advice.verdict === "taxReturn"}
          muted={advice.verdict === "oneStop"}
          steps={[
            "各自治体の受領証明書（または寄附金控除に関する証明書）を保管します。",
            "医療費控除や住宅ローン控除初年度がある人は、同じ申告にふるさと納税も含めます。",
            `申告期間の目安は ${advice.deadlines.taxReturn} です（還付申告は1月から可能なことがあります）。`,
          ]}
          notes={[
            "所得税の還付と、翌年の住民税減額の両方で控除されます。",
            "ワンストップ特例を出していても、申告すればそちらが優先されます。",
            "e-Taxなら証明書データを添付できる場合があります。",
          ]}
        />
      </div>
    </section>
  );
}

function ProcedureCard({
  title,
  steps,
  notes,
  emphasized,
  muted,
}: {
  title: string;
  steps: string[];
  notes: string[];
  emphasized: boolean;
  muted: boolean;
}) {
  return (
    <div
      data-pdf-block
      className={`min-w-0 overflow-visible rounded-xl border p-6 ${
        emphasized
          ? "border-cedar-300 bg-cedar-50"
          : muted
            ? "border-ink-100 bg-white opacity-80"
            : "border-ink-100 bg-white"
      }`}
    >
      <p className="font-display text-lg text-ink-950">
        {title}
        {emphasized ? <span className="ml-2 text-xs font-semibold tracking-wide text-cedar-800">おすすめ</span> : null}
      </p>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-8 text-ink-800">
        {steps.map((step) => (
          <li key={step} className="min-w-0 break-words">
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs font-medium leading-7 text-ink-800">注意点</p>
      <ul className="mt-1 list-disc space-y-2 pl-5 field-hint">
        {notes.map((note) => (
          <li key={note} className="min-w-0 break-words">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
