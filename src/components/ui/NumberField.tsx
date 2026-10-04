"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
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

const INPUT_CLASS = "field-input";

export function NumberField({
  label,
  value,
  onChange,
  hint,
  suffix = "円",
  badge,
  id,
}: NumberFieldProps) {
  const fieldId = id ?? `field-${label}`;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const display = value === "" ? "" : String(value);

  return (
    <div className="block min-w-0 space-y-1.5">
      <label
        htmlFor={mounted ? fieldId : undefined}
        className="flex min-w-0 flex-wrap items-center gap-2"
      >
        <span className="min-w-0 break-words text-sm font-medium leading-6 text-ink-800">
          {label}
        </span>
        {badge ? (
          <span className="shrink-0 rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-wide text-ink-700">
            {badge}
          </span>
        ) : null}
      </label>
      <div className="flex min-w-0 items-stretch">
        {mounted ? (
          <input
            id={fieldId}
            name={fieldId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder="未入力"
            className={INPUT_CLASS}
            value={display}
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
        ) : (
          <span className={INPUT_CLASS} aria-hidden>
            {display || "\u00a0"}
          </span>
        )}
        <span className="inline-flex shrink-0 items-center rounded-r-md border border-l-0 border-ink-200 bg-ink-50 px-3.5 text-sm leading-none text-ink-500">
          {suffix}
        </span>
      </div>
      {hint ? <p className="text-xs leading-6 text-ink-500">{hint}</p> : null}
    </div>
  );
}
