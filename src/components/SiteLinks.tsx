"use client";

import { affiliateImpressionPixels, wrapAffiliateUrl } from "@/lib/affiliates";
import { buildPortalLinks, pinpointHeadingParts } from "@/lib/giftCatalog";

interface SiteLinksProps {
  keyword: string;
  amount?: number;
  heading: string | ReturnType<typeof pinpointHeadingParts>;
  appear?: boolean;
}

export function SiteLinks({ keyword, amount, heading, appear = false }: SiteLinksProps) {
  const sites = buildPortalLinks(keyword, amount);
  const pixels = affiliateImpressionPixels();
  const parts = typeof heading === "string" ? { accent: heading, rest: "", full: heading } : heading;

  return (
    <nav
      data-pdf-hide
      className={`relative min-w-0 overflow-hidden rounded-2xl border border-cedar-200 bg-[#fbf8f3] p-5 sm:p-6 ${appear ? "gift-pinpoint" : ""}`}
      aria-label={parts.full}
    >
      <p className="kicker">PORTALS</p>
      <p key={parts.full} className="gift-heading-swap mt-2 font-display text-xl leading-snug text-ink-950 sm:text-[1.35rem]">
        {parts.rest ? (
          <>
            <span className="font-bold text-cedar-800">{parts.accent}</span>
            <span>{parts.rest}</span>
          </>
        ) : (
          parts.full
        )}
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sites.map((site) => {
          const href = wrapAffiliateUrl(site.id, site.searchUrl, site.searchParts);
          return (
            <li key={site.id} className="min-w-0">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer sponsored nofollow"
                className="btn-portal"
              >
                <span className="absolute inset-y-0 left-0 w-1.5 bg-cedar-400" aria-hidden />
                <span className="min-w-0 flex-1 pl-2">
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-1">
                    <span className="text-[15px] font-bold leading-6 text-ink-950">{site.name}</span>
                    <span className="whitespace-nowrap text-[15px] font-bold leading-6 text-cedar-800">
                      で探す
                    </span>
                  </span>
                  <span className="mt-1 flex min-w-0 items-center gap-2">
                    <span className="min-w-0 truncate text-xs font-medium leading-6 text-ink-700" title={site.query}>
                      {site.query}
                    </span>
                    <span className="shrink-0 whitespace-nowrap rounded-full border border-ink-200 bg-ink-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink-600">
                      外部サイト
                    </span>
                  </span>
                </span>
                <span className="btn-portal-arrow shrink-0" aria-hidden>
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {pixels.map((src) => (
        <img
          key={src}
          src={src}
          width={1}
          height={1}
          alt=""
          decoding="async"
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      ))}
    </nav>
  );
}
