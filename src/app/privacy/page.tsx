import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description:
    "ふるさと納税の控除上限額シミュレーション（限度額計算）サイトにおける個人情報の取り扱い、Cookie、アクセス解析、アフィリエイトに関する方針です。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead="本ポリシーは、当サイトにおける個人情報およびCookie等の取り扱いについて定めるものです。"
    >
      <LegalSection title="1. 事業者">
        <p>
          当サイト「{SITE.name}」（以下「当サイト」）は、{SITE.operatorName}（以下「運営者」）が運営しています。
        </p>
      </LegalSection>

      <LegalSection title="2. 収集する情報">
        <p>当サイトでは、利用目的の達成に必要な範囲で、次の情報を取り扱うことがあります。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>お問い合わせ時に入力いただく氏名、メールアドレス、お問い合わせ内容</li>
          <li>
            シミュレーターへの入力内容および計算結果の下書き・履歴・カート等（ご利用の端末内の
            localStorage に保存します。運営者のサーバーへ自動送信しません）
          </li>
          <li>アクセスログ（IPアドレス、ブラウザ情報、参照元、閲覧日時など。解析ツール導入時）</li>
          <li>Cookieおよび類似技術により取得される識別情報</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. 利用目的">
        <p>取得した情報は、次の目的で利用します。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>当サイトの提供、改善、不具合対応</li>
          <li>お問い合わせへの回答</li>
          <li>アクセス状況の把握およびサービス改善（アクセス解析）</li>
          <li>アフィリエイト広告の成果計測および関連サービスの提供</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Cookie（クッキー）について">
        <p>
          Cookieとは、ウェブサイトがブラウザを通じて利用者の端末に保存する小さなデータです。当サイトおよび当サイトが利用する第三者は、次の目的でCookie等を使用することがあります。
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>表示の最適化や利便性の向上</li>
          <li>アクセス解析（ページ閲覧数、流入経路などの統計）</li>
          <li>アフィリエイト広告のクリックおよび成果のトラッキング</li>
        </ul>
        <p>
          ブラウザの設定によりCookieを無効化できます。無効にすると、一部機能が利用できない場合があります。
        </p>
      </LegalSection>

      <LegalSection title="5. アクセス解析">
        <p>
          当サイトでは、利用状況の把握のため、Google Analytics その他のアクセス解析ツールを使用することがあります。これらのツールはCookie等を利用して匿名のトラフィックデータを収集します。収集されたデータは各事業者のプライバシーポリシーに基づき管理されます。
        </p>
      </LegalSection>

      <LegalSection title="6. アフィリエイトについて">
        <p>
          当サイトは、ふるさと納税ポータル等のアフィリエイトプログラム（成果報酬型広告）に参加しています。掲載リンクを経由してサービスが利用された場合、運営者が紹介料を受け取ることがあります。アフィリエイト事業者は、成果計測のためにCookie等を使用することがあります。
        </p>
      </LegalSection>

      <LegalSection title="7. 第三者提供">
        <p>
          法令に基づく場合、または利用目的の達成に必要な範囲で解析事業者・アフィリエイト事業者等に情報が提供される場合を除き、本人の同意なく個人情報を第三者に提供しません。
        </p>
      </LegalSection>

      <LegalSection title="8. 安全管理">
        <p>
          運営者は、取り扱う情報の漏えい、滅失、改ざん等を防ぐため、合理的な範囲で適切な管理に努めます。ただし、インターネット通信の性質上、完全な安全性を保証するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="9. 開示・訂正・削除">
        <p>
          ご自身の個人情報の開示、訂正、削除等をご希望の場合は、お問い合わせページよりご連絡ください。本人確認のうえ、法令に従い対応します。端末内の下書き・履歴は、ブラウザの保存データを削除することで消去できます。
        </p>
      </LegalSection>

      <LegalSection title="10. 改定">
        <p>
          本ポリシーは、必要に応じて改定することがあります。改定後の内容は、当ページに掲載した時点から効力を生じます。
        </p>
      </LegalSection>

      <LegalSection title="11. お問い合わせ">
        <p>
          個人情報の取り扱いに関するお問い合わせは、
          <Link
            href="/contact"
            className="text-cedar-800 underline decoration-cedar-300 underline-offset-2 hover:text-cedar-950"
          >
            お問い合わせページ
          </Link>
          をご利用ください。本名や自宅住所はお伺いしません。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
