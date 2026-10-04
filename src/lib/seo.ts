import type { Metadata } from "next";

export const SEO = {
  brand: "Furusato Lab",
  locale: "ja_JP",
  defaultTitle: "ふるさと納税の控除上限額シミュレーション｜限度額を計算",
  defaultDescription:
    "ふるさと納税はいくらまで寄付できる？源泉徴収票から控除上限額をシミュレーションし、自己負担2,000円で済む限度額を無料で計算できます。",
} as const;

export const OG_IMAGE_PATH = "/opengraph-image";

/** サイトマップ lastmod 用。記事の実質的な更新日に合わせて上げる。 */
export const CONTENT_UPDATED = new Date("2026-10-04T00:00:00+09:00");

export const INDEX_FOLLOW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function toCanonicalPath(path: string): string {
  if (path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = toCanonicalPath(path);
  const titleText = typeof title === "string" ? title : title.absolute;
  const ogImage = {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: titleText,
  };

  return {
    title,
    description,
    alternates: { canonical },
    robots: INDEX_FOLLOW_ROBOTS,
    openGraph: {
      title: titleText,
      description,
      url: canonical,
      siteName: SEO.brand,
      locale: SEO.locale,
      type,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

