"use client";

interface StepNavProps {
  steps: string[];
  current: number;
  onSelect: (index: number) => void;
}

export function StepNav({ steps, current, onSelect }: StepNavProps) {
  return (
    <nav aria-label="入力ステップ" className="mb-6">
      <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
        {steps.map((label, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <li key={label} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-ink-900 text-white"
                    : done
                      ? "bg-mist-100 text-mist-800 hover:bg-mist-200"
                      : "bg-ink-100 text-ink-500 hover:bg-ink-200"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    active ? "bg-white/20" : done ? "bg-mist-500 text-white" : "bg-white text-ink-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
              {i < steps.length - 1 ? (
                <span className="hidden text-ink-300 sm:inline" aria-hidden>
                  —
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
