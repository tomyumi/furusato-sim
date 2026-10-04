import type { Metadata } from "next";
import { ClientShell } from "@/components/ClientShell";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl, INDEX_FOLLOW_ROBOTS, OG_IMAGE_PATH, SEO } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SEO.defaultTitle} | ${SEO.brand}`,
    template: `%s | ${SEO.brand}`,
  },
  description: SEO.defaultDescription,
  applicationName: SEO.brand,
  authors: [{ name: SEO.brand }],
  creator: SEO.brand,
  publisher: SEO.brand,
  category: "finance",
  keywords: [
    "ふるさと納税",
    "控除上限額",
    "シミュレーション",
    "副業",
    "ダブルワーク",
    "個人事業主",
    "青色申告",
    "事業所得",
    "住宅ローン控除",
    "限度額 計算",
    "ふるさと納税 いくらまで",
  ],
  robots: INDEX_FOLLOW_ROBOTS,
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: siteUrl,
    siteName: SEO.brand,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SEO.defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [OG_IMAGE_PATH],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "N-noCgUJH5_9fg03bsMDHLfn3A5OerHBn3TeB9SaaMw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="N-noCgUJH5_9fg03bsMDHLfn3A5OerHBn3TeB9SaaMw" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SEO.brand,
            alternateName: SITE.name,
            url: siteUrl,
            inLanguage: "ja",
            description: SEO.defaultDescription,
          }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <ClientShell>{children}</ClientShell>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
