import type { ReactNode } from "react";

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
};

export function LegalPage({ title, lead, children }: Props) {
  return (
    <main className="page-shell">
      <p className="kicker">FURUSATO NOZEI</p>
      <nav aria-label="パンくずリスト" className="mt-4 text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <a href="/" className="text-ink-600 no-underline hover:text-cedar-800">
              控除上限額シミュレーション
            </a>
          </li>
          <li className="text-ink-400" aria-hidden>
            ／
          </li>
          <li>
            <a href="/guides" className="text-ink-600 no-underline hover:text-cedar-800">
              限度額の解説コラム
            </a>
          </li>
        </ol>
      </nav>
      <h1 className="mt-6 font-display text-3xl text-ink-950 sm:text-4xl">{title}</h1>
      {lead ? <p className="lede mt-4 max-w-2xl">{lead}</p> : null}
      <article className="card mt-10 space-y-8 text-[15px] leading-8 text-ink-800">{children}</article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-ink-950">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
