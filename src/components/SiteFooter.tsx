import Link from "next/link";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/#simulator", label: "控除上限額シミュレーション" },
  { href: "/guides", label: "限度額の解説コラム" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclaimer", label: "免責事項・運営者情報" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-100 bg-ink-950 text-ink-200" suppressHydrationWarning>
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
        <p className="kicker text-cedar-300">FURUSATO LAB</p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ink-300">
          ふるさと納税の控除上限額をシミュレーションし、限度額を計算するための目安ツールです。税務アドバイスではありません。最新の法令と各自治体の案内を優先してください。
        </p>
        <nav aria-label="サイト情報" className="mt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  suppressHydrationWarning
                  className="text-ink-200 no-underline transition hover:text-cedar-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs tracking-wide text-ink-400">
          {SITE.operatorName} ／ {SITE.name}
        </p>
      </div>
    </footer>
  );
}
