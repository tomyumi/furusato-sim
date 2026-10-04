import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ふるさと納税はいくらまで？限度額・控除上限額シミュレーションの解説コラム",
  description:
    "ふるさと納税はいくらまで寄付できるか、控除上限額のシミュレーションに役立つ限度額の計算、ワンストップ特例、返礼品、年末の注意点を解説します。",
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <main className="page-shell">
      <p className="kicker">COLUMN</p>
      <h1 className="mt-3 font-display text-3xl text-ink-950 sm:text-4xl">
        ふるさと納税はいくらまで？限度額・控除上限の解説
      </h1>
      <p className="lede mt-4 max-w-2xl">
        控除上限額のしくみ、限度額の計算、申告の選び方、返礼品、年末の期限まで、検索で調べた人が一通り読み切れる分量でまとめています。自分の枠を計算するには
        <Link href="/#simulator" className="mx-1 font-medium text-cedar-800 no-underline hover:underline">
          控除上限額シミュレーション
        </Link>
        をご利用ください。
      </p>
      <ul className="mt-10 space-y-5">
        {GUIDES.map((guide) => (
          <li key={guide.slug} className="card p-6 sm:p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-cedar-700">{guide.category}</p>
            <h2 className="mt-2 font-display text-xl leading-snug text-ink-950">
              <Link href={guide.href} className="text-ink-950 no-underline hover:text-cedar-800">
                {guide.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-600">{guide.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
