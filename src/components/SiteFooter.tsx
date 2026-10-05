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
      <div className="mx-auto w-full max-w-4xl px-3 py-10 md:px-6 md:py-12 lg:px-8">
        <p className="kicker text-cedar-300" suppressHydrationWarning>
          FURUSATO LAB
        </p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ink-300" suppressHydrationWarning>
          副業・個人事業主・住宅ローン控除に対応した、ふるさと納税の控除上限額シミュレーターです。本業と副業の合算、青色申告の事業所得、住宅ローン控除の住民税への振替を含めた限度額の目安を計算します。税務アドバイスではありません。最新の法令と各自治体の案内を優先してください。
        </p>
        <nav aria-label="サイト情報" className="mt-8" suppressHydrationWarning>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm" suppressHydrationWarning>
            {LINKS.map((link) => (
              <li key={link.href} suppressHydrationWarning>
                <a
                  href={link.href}
                  suppressHydrationWarning
                  className="text-ink-200 no-underline transition hover:text-cedar-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs tracking-wide text-ink-400" suppressHydrationWarning>
          {SITE.operatorName} ／ {SITE.name}
        </p>
      </div>
    </footer>
  );
}
