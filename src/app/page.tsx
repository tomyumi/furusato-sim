import { ClientOnly } from "@/components/ClientOnly";
import { HomeEditorial } from "@/components/HomeEditorial";
import { JsonLd } from "@/components/JsonLd";
import { ScopeNotice } from "@/components/ScopeNotice";
import { Simulator, SimulatorPlaceholder } from "@/components/Simulator";
import { HOME_FAQS } from "@/lib/guides";
import { getSiteUrl, pageMetadata, SEO } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: { absolute: `${SEO.defaultTitle} | ${SEO.brand}` },
  description: SEO.defaultDescription,
  path: "/",
});

export default function HomePage() {
  const siteUrl = getSiteUrl();

  return (
    <main className="page-shell">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE.name,
            url: siteUrl,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            inLanguage: "ja",
            description: SEO.defaultDescription,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "JPY",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          },
        ]}
      />
      <div className="mb-10 min-w-0 space-y-5 sm:mb-12">
        <p className="kicker">SIMULATOR</p>
        <h1 className="font-display text-3xl font-semibold text-ink-950 sm:text-5xl sm:leading-tight">
          ふるさと納税はいくらまで？
          <span className="mt-2 block text-[0.92em] text-cedar-700">控除上限額シミュレーション</span>
        </h1>
        <p className="lede max-w-2xl">
          源泉徴収票の「支払金額」や「社会保険料等の金額」を書き写すと、自己負担2,000円で済む控除上限額（限度額）の目安を計算できます。
          会社員でも副業・事業所得がある人でも使えます。仕組みや申告の違いは、下の解説もご覧ください。
        </p>
        <ScopeNotice />
      </div>
      <ClientOnly fallback={<SimulatorPlaceholder />}>
        <Simulator />
      </ClientOnly>
      <HomeEditorial />
    </main>
  );
}
