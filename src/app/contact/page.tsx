import { ContactForm } from "@/components/ContactForm";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { hasContactEmail, SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description:
    "ふるさと納税の控除上限額シミュレーション（限度額計算）に関するお問い合わせ窓口です。サービス内容、個人情報、不具合のご連絡を受け付けます。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="お問い合わせ"
      lead="本ページのフォームが正規の連絡窓口です。サービス内容、個人情報の取り扱い、不具合などはこちらからご連絡ください。"
    >
      <LegalSection title="お問い合わせフォーム">
        <p>
          {SITE.operatorName}が受け付けます。本名やご住所の記入は不要です。折り返しが必要な場合のみ、返信可能なメールアドレスをご記入ください。
        </p>
        <ContactForm />
      </LegalSection>

      {hasContactEmail() ? (
        <LegalSection title="メールでのご連絡">
          <p>フォームが使えない場合は、専用メールアドレスへ直接ご連絡ください。</p>
          <p>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-cedar-800 underline decoration-cedar-300 underline-offset-2 hover:text-cedar-950"
            >
              {SITE.contactEmail}
            </a>
          </p>
        </LegalSection>
      ) : null}

      <LegalSection title="ご注意">
        <p>
          個別の税額計算や申告方法についての税務相談にはお答えできません。税務上の判断は、管轄の税務署または専門家へご確認ください。内容の確認には数日いただく場合があります。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
