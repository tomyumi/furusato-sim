import type { Metadata } from "next";
import { ClientShell } from "@/components/ClientShell";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl, OG_IMAGE_PATH, SEO } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
    "限度額 計算",
    "ふるさと納税 いくらまで",
    "控除上限額 シミュレーション",
    "限度額",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: "/",
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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <ClientShell>{children}</ClientShell>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
