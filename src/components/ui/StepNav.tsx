"use client";

interface StepNavProps {
  steps: string[];
  current: number;
  onSelect: (index: number) => void;
}

export function StepNav({ steps, current, onSelect }: StepNavProps) {
  return (
    <nav aria-label="入力ステップ" className="mb-4">
      <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((label, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <li key={label} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`flex w-full min-w-0 items-start gap-2 overflow-visible rounded-xl px-3 py-2 text-left text-sm leading-5 transition ${
                  active
                    ? "bg-ink-900 text-white"
                    : done
                      ? "bg-mist-100 text-mist-800 hover:bg-mist-200"
                      : "bg-ink-100 text-ink-500 hover:bg-ink-200"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    active ? "bg-white/20" : done ? "bg-mist-500 text-white" : "bg-white text-ink-500"
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
