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
    <main className="page-shell" suppressHydrationWarning>
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
        <p className="kicker" suppressHydrationWarning>
          SIMULATOR
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink-950 sm:text-5xl sm:leading-tight" suppressHydrationWarning>
          副業・個人事業主・住宅ローン控除に対応
          <span className="mt-2 block text-[0.92em] text-cedar-700">
            ふるさと納税の控除上限額シミュレーション
          </span>
        </h1>
        <p className="lede max-w-2xl" suppressHydrationWarning>
          副業やダブルワークで本業と収入を合算する方、青色申告の事業所得がある個人事業主、住宅ローン控除で所得税から引ききれず住民税へ振り替える方など、税金計算が複雑な人向けの限度額シミュレーターです。
          源泉徴収票の数字を書き写すだけで、自己負担2,000円で済む控除上限額の目安を、複雑な手計算なしで確認できます。
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
