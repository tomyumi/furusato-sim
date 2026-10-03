const SITES = [
  { name: "楽天ふるさと納税", href: "#" },
  { name: "さとふる", href: "#" },
  { name: "ふるさとチョイス", href: "#" },
  { name: "ふるなび", href: "#" },
] as const;

export function SiteLinks() {
  return (
    <nav
      data-pdf-hide
      className="min-w-0 rounded-xl border border-ink-200 bg-ink-50/70 px-3.5 py-3"
      aria-label="ふるさと納税サイト"
    >
      <p className="text-sm font-semibold leading-6 text-ink-900">返礼品を探す</p>
      <p className="mt-0.5 text-xs leading-5 text-ink-500">
        算出した上限額を目安に、各サイトで寄付先を選べます。
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SITES.map((site) => (
          <li key={site.name} className="min-w-0">
            <a
              href={site.href}
              className="flex min-w-0 items-center justify-center rounded-full border border-ink-300 bg-white px-4 py-2.5 text-sm font-medium leading-5 text-ink-800 transition hover:border-mist-500 hover:bg-mist-50 hover:text-mist-900"
            >
              {site.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
