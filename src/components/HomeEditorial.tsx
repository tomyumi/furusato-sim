import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { GUIDES, HOME_FAQS } from "@/lib/guides";

export function HomeEditorial() {
  return (
    <div className="mt-16 space-y-16 sm:mt-20">
      <section aria-labelledby="guides-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">COLUMN</p>
            <h2 id="guides-heading" className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">
              ふるさと納税はいくらまで？解説コラム
            </h2>
          </div>
          <Link
            href="/guides"
            className="shrink-0 text-sm font-medium text-cedar-800 no-underline transition hover:text-cedar-950"
          >
            限度額の解説一覧
          </Link>
        </div>
        <p className="lede mt-3 max-w-2xl">
          控除上限額のしくみ、限度額の計算、申告の選び方、返礼品、年末の期限まで、検索の意図に合わせてまとめています。
        </p>
        <ul className="mt-8 grid gap-5">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={guide.href}
                className="card block p-6 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-cedar-200 sm:p-7"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-cedar-700">{guide.category}</p>
                <p className="mt-2 font-display text-xl leading-snug text-ink-950">{guide.title}</p>
                <p className="mt-3 text-sm leading-7 text-ink-600">{guide.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-heading">
        <p className="kicker">Q&amp;A</p>
        <h2 id="faq-heading" className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">
          限度額・控除上限額のよくある質問
        </h2>
        <div className="mt-8 space-y-3">
          {HOME_FAQS.map((item) => (
            <Accordion key={item.q} title={item.q}>
              <p className="text-sm leading-7 text-ink-700">{item.a}</p>
            </Accordion>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-heading" className="card-muted">
        <h2 id="about-heading" className="font-display text-xl text-ink-950">
          この限度額シミュレーションについて
        </h2>
        <p className="mt-3 text-sm leading-8 text-ink-700">
          Furusato Lab は、ふるさと納税をいくらまで寄付できるかの目安計算と、控除上限額・限度額の解説を扱うメディアです。入力はブラウザ内で完結し、計算結果は概算です。株式の申告分離課税や損失の繰越など、複雑な事情がある方は対象外となる場合があります。最新の法令・各自治体の案内を優先してください。
        </p>
      </section>
    </div>
  );
}
