"use client";

import { useState, type ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  /** Closed-state hint, e.g. 未入力（0人として計算） */
  summary?: string;
  variant?: "gold" | "form";
  openLabel?: string;
  closeLabel?: string;
}

function panelIdFromTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0;
  }
  return `acc-${(hash >>> 0).toString(36)}`;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  forceOpen = false,
  summary,
  variant = "gold",
  openLabel,
  closeLabel,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = panelIdFromTitle(title);
  const shown = forceOpen || open;
  const isForm = variant === "form";
  const toggleText = isForm ? (shown ? (closeLabel ?? "閉じる") : (openLabel ?? "詳細を開く")) : null;

  return (
    <div
      data-pdf-block
      className={
        isForm
          ? "min-w-0 overflow-visible rounded-xl border border-ink-100 bg-white"
          : "min-w-0 overflow-visible rounded-xl border border-cedar-200 bg-[#fbf8f3]"
      }
    >
      <button
        type="button"
        data-pdf-unit
        suppressHydrationWarning
        className={
          isForm
            ? "flex w-full min-w-0 items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-ink-50 sm:px-5"
            : "flex w-full min-w-0 items-start justify-between gap-3 px-5 py-4 text-left text-sm font-semibold leading-6 text-ink-950 transition hover:bg-cedar-100/50"
        }
        aria-expanded={shown}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="min-w-0">
          <span className={`block min-w-0 break-words ${isForm ? "text-sm font-medium text-ink-800" : ""}`}>
            {title}
          </span>
          {!shown && summary ? (
            <span className="field-hint mt-1 block">{summary}</span>
          ) : null}
        </span>
        <span
          data-pdf-hide
          className={`mt-0.5 inline-flex shrink-0 items-center gap-1 ${
            isForm ? "text-xs font-medium text-cedar-800" : "text-cedar-600"
          }`}
        >
          {toggleText ? <span>{toggleText}</span> : null}
          <span className={`transition-transform ${shown ? "rotate-180" : ""}`} aria-hidden>
            ▾
          </span>
        </span>
      </button>
      {shown ? (
        <div
          id={panelId}
          className={
            isForm
              ? "min-w-0 border-t border-ink-100 px-4 pb-4 pt-4 sm:px-5"
              : "min-w-0 border-t border-cedar-200 px-5 pb-5 pt-4"
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
