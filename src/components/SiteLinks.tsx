"use client";

import { buildPortalLinks } from "@/lib/giftCatalog";

interface SiteLinksProps {
  keyword: string;
  amount?: number;
  heading: string;
  appear?: boolean;
}

export function SiteLinks({ keyword, amount, heading, appear = false }: SiteLinksProps) {
  const sites = buildPortalLinks(keyword, amount);
  const sample = sites[0]?.query ?? keyword;

  return (
    <nav
      data-pdf-hide
      className={`min-w-0 rounded-xl border border-cedar-200 bg-[#fbf8f3] p-5 sm:p-6 ${appear ? "gift-pinpoint" : ""}`}
      aria-label={heading}
    >
      <p className="kicker">PORTALS</p>
      <p className="mt-2 font-display text-lg leading-snug text-ink-950">{heading}</p>
      <p className="mt-2 text-sm leading-7 text-ink-600">
        選んだ条件で、各ふるさと納税ポータルの検索ページを新しいタブで開きます。広告リンクです。
      </p>
      <p className="mt-1 break-words text-xs leading-6 text-ink-500">検索キーワード例: {sample}</p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sites.map((site) => (
          <li key={site.name} className="min-w-0">
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              className="btn-portal"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-cedar-400" aria-hidden />
              <span className="pl-2">
                <span className="block text-sm font-semibold text-ink-950">{site.name}で探す</span>
                <span className="mt-0.5 block text-xs font-medium text-ink-500">
                  {sample}（外部サイト）
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-cedar-700" aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
