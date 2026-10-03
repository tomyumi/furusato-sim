"use client";

import type { InputHTMLAttributes } from "react";
import type { OptionalNumber } from "@/lib/numbers";

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label: string;
  value: OptionalNumber;
  onChange: (value: OptionalNumber) => void;
  hint?: string;
  suffix?: string;
  badge?: string;
}

const INPUT_CLASS =
  "min-w-0 w-full rounded-l-xl border border-ink-200 bg-white px-3 py-2 text-right text-ink-900 shadow-sm outline-none transition placeholder:text-ink-300 focus:border-mist-500 focus:ring-2 focus:ring-mist-200";

export function NumberField({
  label,
  value,
  onChange,
  hint,
  suffix = "円",
  badge,
  id,
  ...rest
}: NumberFieldProps) {
  const fieldId = id ?? `field-${label}`;

  return (
    <label className="block min-w-0 space-y-1" htmlFor={fieldId}>
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="min-w-0 break-words text-sm font-medium leading-5 text-ink-800">
          {label}
        </span>
        {badge ? (
          <span className="shrink-0 rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-medium leading-4 text-mist-800">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="flex min-w-0 items-stretch">
        <input
          {...rest}
          id={fieldId}
          name={fieldId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="未入力"
          className={INPUT_CLASS}
          value={value === "" ? "" : String(value)}
          suppressHydrationWarning
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d-]/g, "");
            if (raw === "" || raw === "-") {
              onChange("");
              return;
            }
            const n = Number(raw);
            onChange(Number.isFinite(n) ? Math.trunc(n) : "");
          }}
        />
        <span className="inline-flex shrink-0 items-center rounded-r-xl border border-l-0 border-ink-200 bg-ink-50 px-3 text-sm leading-none text-ink-500">
          {suffix}
        </span>
      </span>
      {hint ? (
        <span className="block text-xs leading-5 text-ink-500">{hint}</span>
      ) : null}
    </label>
  );
}
