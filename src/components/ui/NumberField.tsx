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
  const fieldId = id ?? label;

  return (
    <label className="block space-y-1.5" htmlFor={fieldId}>
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-800">{label}</span>
        {badge ? (
          <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-medium text-mist-800">
            {badge}
          </span>
        ) : null}
      </span>
      <div className="relative">
        <input
          id={fieldId}
          type="number"
          inputMode="numeric"
          placeholder="未入力"
          className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 pr-12 text-right text-ink-900 shadow-sm outline-none transition placeholder:text-ink-300 focus:border-mist-500 focus:ring-2 focus:ring-mist-200"
          value={value === "" ? "" : value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange("");
              return;
            }
            const n = Number(raw);
            onChange(Number.isFinite(n) ? Math.trunc(n) : "");
          }}
          {...rest}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
          {suffix}
        </span>
      </div>
      {hint ? <span className="block text-xs leading-relaxed text-ink-500">{hint}</span> : null}
    </label>
  );
}
