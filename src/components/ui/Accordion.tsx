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
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink-800 transition hover:bg-ink-50"
        aria-expanded={shown}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className={`text-ink-400 transition-transform ${shown ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {shown ? (
        <div id={panelId} className="border-t border-ink-100 px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
