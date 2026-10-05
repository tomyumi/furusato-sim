"use client";

import { useLayoutEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import {
  caretFromDigitCount,
  digitCountBeforeCaret,
  formatGroupedInteger,
  parseGroupedIntegerInput,
} from "@/lib/groupedIntegerInput";
import type { OptionalNumber } from "@/lib/numbers";

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label: string;
  value: OptionalNumber;
  onChange: (value: OptionalNumber) => void;
  hint?: string;
  suffix?: string;
  badge?: string;
  /** 3桁カンマ。金額（円）は既定でオン、年・人数はオフ */
  grouped?: boolean;
  allowNegative?: boolean;
}

const INPUT_CLASS = "field-input";

export function NumberField({
  label,
  value,
  onChange,
  hint,
  suffix = "円",
  badge,
  id,
  grouped: groupedProp,
  allowNegative = false,
}: NumberFieldProps) {
  const grouped = groupedProp ?? suffix === "円";
  const fieldId = id ?? `field-${label}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const caretDigitsRef = useRef<number | null>(null);
  const [pendingMinus, setPendingMinus] = useState(false);

  const display =
    pendingMinus && value === "" ? "-" : formatGroupedInteger(value, grouped);

  useLayoutEffect(() => {
    if (value !== "") setPendingMinus(false);
  }, [value]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const digits = caretDigitsRef.current;
    if (!input || digits == null) return;
    caretDigitsRef.current = null;
    const pos = caretFromDigitCount(input.value, digits);
    input.setSelectionRange(pos, pos);
  }, [display]);

  function commitRaw(raw: string, digitCount: number) {
    const parsed = parseGroupedIntegerInput(raw, allowNegative);
    const nextDisplay = parsed.pendingMinus ? "-" : formatGroupedInteger(parsed.value, grouped);
    caretDigitsRef.current = digitCount;
    setPendingMinus(parsed.pendingMinus);
    onChange(parsed.value);
    if (nextDisplay === display && parsed.pendingMinus === pendingMinus) {
      caretDigitsRef.current = null;
      const input = inputRef.current;
      if (input) {
        const pos = caretFromDigitCount(nextDisplay, digitCount);
        input.setSelectionRange(pos, pos);
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.preventDefault();
    if (!grouped) return;
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;

    const input = e.currentTarget;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start == null || end == null || start !== end) return;
    const text = input.value;

    if (e.key === "Backspace" && start > 0 && text[start - 1] === ",") {
      e.preventDefault();
      const next = `${text.slice(0, start - 2)}${text.slice(start)}`;
      commitRaw(next, digitCountBeforeCaret(next, start - 2));
      return;
    }
    if (e.key === "Delete" && start < text.length && text[start] === ",") {
      e.preventDefault();
      const next = `${text.slice(0, start)}${text.slice(start + 2)}`;
      commitRaw(next, digitCountBeforeCaret(next, start));
    }
  }

  return (
    <div className="block min-w-0 space-y-2.5">
      <label htmlFor={fieldId} className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="field-label min-w-0 break-words">
          {label}
        </span>
        {badge ? (
          <span className="shrink-0 rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-wide text-ink-700">
            {badge}
          </span>
        ) : null}
      </label>
      <div className="flex min-w-0 items-stretch">
        <input
          ref={inputRef}
          id={fieldId}
          name={fieldId}
          type="text"
          inputMode={allowNegative ? "decimal" : "numeric"}
          autoComplete="off"
          spellCheck={false}
          placeholder="未入力"
          className={`${INPUT_CLASS} tabular-nums`}
          suppressHydrationWarning
          value={display}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            const el = e.target;
            const caret = el.selectionStart ?? el.value.length;
            commitRaw(el.value, digitCountBeforeCaret(el.value, caret));
          }}
        />
        <span className="inline-flex shrink-0 items-center rounded-r-md border border-l-0 border-ink-200 bg-ink-50 px-3.5 text-sm leading-none text-ink-700">
          {suffix}
        </span>
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}
