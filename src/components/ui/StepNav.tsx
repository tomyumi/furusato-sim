"use client";

interface StepNavProps {
  steps: string[];
  current: number;
  onSelect: (index: number) => void;
}

export function StepNav({ steps, current, onSelect }: StepNavProps) {
  return (
    <nav aria-label="入力ステップ">
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((label, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <li key={label} className="min-w-0">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onSelect(i)}
                className={`flex w-full min-w-0 items-start gap-2.5 overflow-visible rounded-md px-3.5 py-3 text-left text-sm leading-5 transition duration-200 ${
                  active
                    ? "bg-ink-900 text-white shadow-sm"
                    : done
                      ? "border border-cedar-200 bg-cedar-50 text-cedar-900 hover:bg-cedar-100"
                      : "border border-ink-100 bg-white text-ink-500 hover:border-ink-200 hover:bg-ink-50"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                    active
                      ? "bg-cedar-400 text-ink-950"
                      : done
                        ? "bg-cedar-600 text-white"
                        : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="min-w-0 break-words">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
