const NAV = [
  { href: "/#simulator", label: "控除上限額シミュレーション" },
  { href: "/guides", label: "限度額の解説コラム" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export function SiteNav() {
  return (
    <nav aria-label="主要メニュー">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        {NAV.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="text-ink-700 no-underline transition hover:text-cedar-700" suppressHydrationWarning>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
