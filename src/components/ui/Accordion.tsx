"use client";

import { useId, useState, type ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  forceOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const shown = forceOpen || open;

  return (
    <div
      data-pdf-block
      className="min-w-0 overflow-visible rounded-xl border border-cedar-300 bg-[#fbf8f3]"
    >
      <button
        type="button"
        data-pdf-unit
        className="flex w-full min-w-0 items-start justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium leading-6 text-cedar-950 transition hover:bg-cedar-100/60"
        aria-expanded={shown}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="min-w-0 break-words">{title}</span>
        <span
          data-pdf-hide
          className={`mt-1 shrink-0 text-cedar-600 transition-transform ${shown ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {shown ? (
        <div id={panelId} className="min-w-0 border-t border-cedar-200 px-3.5 pb-3 pt-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
