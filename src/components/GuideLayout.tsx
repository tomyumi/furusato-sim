import Link from "next/link";
import type { ReactNode } from "react";
import { GUIDES } from "@/lib/guides";

type Props = {
  slug: string;
  title: string;
  lead: string;
  children: ReactNode;
};

export function GuideLayout({ slug, title, lead, children }: Props) {
  const related = GUIDES.filter((g) => g.slug !== slug);

  return (
    <main className="page-shell">
      <nav aria-label="パンくずリスト" className="text-sm text-ink-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="text-ink-600 no-underline hover:text-cedar-800">
              控除上限額シミュレーション
            </Link>
          </li>
          <li aria-hidden className="text-ink-400">
            /
          </li>
          <li>
            <Link href="/guides" className="text-ink-600 no-underline hover:text-cedar-800">
              限度額の解説コラム
            </Link>
          </li>
        </ol>
      </nav>
      <p className="mt-8 kicker">GUIDE</p>
      <h1 className="mt-3 font-display text-3xl text-ink-950 sm:text-4xl">{title}</h1>
      <p className="lede mt-4 max-w-2xl">{lead}</p>
      <p className="mt-3 text-xs tracking-wide text-ink-400">
        最終更新：2026年10月　／　一般的な制度の解説（税務相談ではありません）
      </p>
      <article className="card mt-10 space-y-8 text-[15px] leading-8 text-ink-800">{children}</article>
      <aside className="card-gold mt-10 text-sm leading-7 text-cedar-950">
        ふるさと納税の控除上限額・限度額の計算は
        <Link href="/#simulator" className="mx-1 font-semibold text-ink-950 no-underline hover:underline">
          控除上限額シミュレーション
        </Link>
        で確認できます。正確な税額は管轄の税務署・自治体へご確認ください。
      </aside>
      <section className="mt-12">
        <h2 className="font-display text-xl text-ink-950">あわせて読む</h2>
        <ul className="mt-4 space-y-3">
          {related.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={guide.href}
                className="text-sm font-medium text-cedar-800 no-underline hover:text-cedar-950"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export function GuideH2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-xl leading-snug text-ink-950">{children}</h2>;
}

export function GuideH3({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold leading-7 text-ink-900">{children}</h3>;
}
