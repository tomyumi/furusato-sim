"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface HelpTipProps {
  label: string;
  children: ReactNode;
}

export function HelpTip({ label, children }: HelpTipProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placeAbove: false, viewportHeight: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tipId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  function updatePosition() {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const width = Math.min(288, window.innerWidth - 24);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < 160 && rect.top > spaceBelow;
    const top = placeAbove ? rect.top - 8 : rect.bottom + 8;
    setCoords({ top, left, placeAbove, viewportHeight: window.innerHeight });
  }

  function show() {
    updatePosition();
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") hide();
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      hide();
    }
    function onReposition() {
      updatePosition();
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-white text-[11px] font-semibold leading-none text-ink-600 hover:border-cedar-400 hover:text-cedar-800"
        aria-label={`${label}の説明`}
        aria-expanded={open}
        aria-controls={open ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={(event) => {
          const next = event.relatedTarget;
          if (next instanceof Node && panelRef.current?.contains(next)) return;
          hide();
        }}
        onFocus={show}
        onBlur={(event) => {
          const next = event.relatedTarget;
          if (next instanceof Node && panelRef.current?.contains(next)) return;
          hide();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (open) hide();
          else show();
        }}
      >
        ?
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              id={tipId}
              role="tooltip"
              className="fixed z-[80] w-72 max-w-[calc(100vw-1.5rem)] rounded-md border border-ink-200 bg-white px-3.5 py-3 text-left text-xs leading-7 text-ink-800 shadow-lg"
              style={{
                top: coords.placeAbove ? undefined : coords.top,
                bottom: coords.placeAbove ? coords.viewportHeight - coords.top : undefined,
                left: coords.left,
              }}
              onMouseEnter={show}
              onMouseLeave={hide}
            >
              <p className="font-semibold text-ink-900">{label}</p>
              <div className="mt-1">{children}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
