export const PORTAL_IDS = ["rakuten", "satofull", "choice", "furanavi"] as const;

export type PortalId = (typeof PORTAL_IDS)[number];

/**
 * 楽天ふるさと納税（A8.net）。検索先は a8ejpredirect 内の hb.afl の pc / m を差し替える。
 * 環境変数があれば上書き。
 */
const DEFAULT_AFFILIATE_RAKUTEN =
  "https://rpx.a8.net/svt/ejp?a8mat=4BE7SW+G82982+2HOM+BW8O1&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26100366468_4BE7SW_G82982_2HOM_BW8O1%3Fpc%3Dhttps%253A%252F%252Fevent.rakuten.co.jp%252Ffurusato%252F%26m%3Dhttps%253A%252F%252Fevent.rakuten.co.jp%252Ffurusato%252F";

function affiliateTemplate(portalId: PortalId): string {
  const fromEnv =
    portalId === "rakuten"
      ? process.env.NEXT_PUBLIC_AFFILIATE_RAKUTEN
      : portalId === "satofull"
        ? process.env.NEXT_PUBLIC_AFFILIATE_SATOFULL
        : portalId === "choice"
          ? process.env.NEXT_PUBLIC_AFFILIATE_CHOICE
          : process.env.NEXT_PUBLIC_AFFILIATE_FURANAVI;
  const trimmed = fromEnv?.trim() ?? "";
  if (trimmed) return trimmed;
  return portalId === "rakuten" ? DEFAULT_AFFILIATE_RAKUTEN : "";
}

const ALLOWED_DESTINATION_HOSTS = new Set([
  "search.rakuten.co.jp",
  "item.rakuten.co.jp",
  "event.rakuten.co.jp",
  "www.rakuten.co.jp",
  "www.satofull.jp",
  "satofull.jp",
  "www.furusato-tax.jp",
  "furusato-tax.jp",
  "furunavi.jp",
  "www.furunavi.jp",
]);

export interface AffiliateSearchParts {
  query: string;
  amount?: number;
  min?: number;
  max?: number;
}

function parseWebUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

function isHttpsUrl(value: string): URL | null {
  const url = parseWebUrl(value);
  if (!url || url.protocol !== "https:") return null;
  return url;
}

function isAllowedDestination(href: string): boolean {
  const url = isHttpsUrl(href);
  return Boolean(url && ALLOWED_DESTINATION_HOSTS.has(url.hostname));
}

function isSafeAffiliateTemplate(template: string): boolean {
  const sample = template
    .replaceAll("{url}", "https://example.com/")
    .replaceAll("{query}", "test")
    .replaceAll("{amount}", "10000")
    .replaceAll("{min}", "8500")
    .replaceAll("{max}", "11500");
  return isHttpsUrl(sample) !== null;
}

function encodeQueryValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function fillPlaceholders(template: string, destination: string, parts?: AffiliateSearchParts): string {
  const amount = parts?.amount && parts.amount > 0 ? String(Math.round(parts.amount)) : "";
  const min = parts?.min && parts.min > 0 ? String(Math.round(parts.min)) : "";
  const max = parts?.max && parts.max > 0 ? String(Math.round(parts.max)) : "";
  const query = parts?.query?.trim() ?? "";

  return template
    .replaceAll("{url}", encodeURIComponent(destination))
    .replaceAll("{query}", encodeQueryValue(query))
    .replaceAll("{amount}", encodeURIComponent(amount))
    .replaceAll("{min}", encodeURIComponent(min))
    .replaceAll("{max}", encodeURIComponent(max));
}

function isRakutenAflHost(hostname: string): boolean {
  return hostname === "hb.afl.rakuten.co.jp" || hostname.endsWith(".afl.rakuten.co.jp");
}

function withRakutenLanding(aflHref: string, destination: string): string {
  const afl = parseWebUrl(aflHref);
  if (!afl || !isRakutenAflHost(afl.hostname)) return aflHref;
  afl.searchParams.set("pc", destination);
  afl.searchParams.set("m", destination);
  return afl.toString();
}

function attachRedirect(template: string, destination: string): string {
  const outer = isHttpsUrl(template);
  if (!outer) return destination;

  const host = outer.hostname;
  const isA8 = host.endsWith("a8.net") || outer.searchParams.has("a8mat");

  if (isA8) {
    const current = outer.searchParams.get("a8ejpredirect");
    if (current && isRakutenAflHost(parseWebUrl(current)?.hostname ?? "")) {
      outer.searchParams.set("a8ejpredirect", withRakutenLanding(current, destination));
      return outer.toString();
    }
    outer.searchParams.set("a8ejpredirect", destination);
    return outer.toString();
  }

  if (host.endsWith("valuecommerce.com")) {
    outer.searchParams.set("vc_url", destination);
    return outer.toString();
  }

  if (isRakutenAflHost(host)) {
    return withRakutenLanding(template, destination);
  }

  outer.searchParams.set("url", destination);
  return outer.toString();
}

/**
 * ポータルの検索結果URLを、アフィリエイト計測URLへ安全に載せる。
 * 楽天A8は内側の hb.afl の pc / m を検索URLに差し替え、外側の a8ejpredirect を再エンコードする。
 */
export function wrapAffiliateUrl(
  portalId: PortalId,
  destination: string,
  parts?: AffiliateSearchParts,
): string {
  if (!isAllowedDestination(destination)) return destination;

  const template = affiliateTemplate(portalId);
  if (!template || !isSafeAffiliateTemplate(template)) return destination;

  const filled = fillPlaceholders(template, destination, parts);

  if (template.includes("{url}")) {
    return filled;
  }

  return attachRedirect(filled, destination);
}

function a8ImpressionSrc(template: string): string | null {
  const url = isHttpsUrl(template.trim());
  const a8mat = url?.searchParams.get("a8mat")?.trim();
  if (!url || !url.hostname.endsWith("a8.net") || !a8mat) return null;
  const encodedMat = encodeURIComponent(a8mat).replace(/%20/g, "+");
  return `https://www15.a8.net/0.gif?a8mat=${encodedMat}`;
}

/** 表示中のA8プログラム用 1px 計測ピクセル（重複排除） */
export function affiliateImpressionPixels(): string[] {
  const seen = new Set<string>();
  for (const id of PORTAL_IDS) {
    const src = a8ImpressionSrc(affiliateTemplate(id));
    if (src) seen.add(src);
  }
  return [...seen];
}
