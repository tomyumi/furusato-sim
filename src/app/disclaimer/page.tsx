import { LegalPage, LegalSection } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { hasContactEmail, SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "免責事項・運営者情報",
  description:
    "ふるさと納税の控除上限額シミュレーション（限度額計算）の結果は概算の目安です。税務アドバイスではない旨の免責事項と運営者情報を掲載しています。",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="免責事項・運営者情報"
      lead="当サイトの利用条件、計算結果の位置づけ、および運営者情報を掲載します。"
    >
      <LegalSection title="免責事項">
        <p>
          当サイトのシミュレーターが示すふるさと納税の控除上限額その他の数値は、一般的な計算モデルに基づく概算の目安です。税務アドバイス、税理士法に基づく税務相談、または個別の申告内容を保証するものではありません。
        </p>
        <p>
          正確な税額、控除額、ワンストップ特例や確定申告の可否は、収入・控除・自治体の取扱い・税制改正などにより異なります。最終的な判断は、管轄の税務署、お住まいの市区町村、または税理士等の専門家にご確認ください。
        </p>
        <p>
          入力内容の誤り、税制の改正、対象外の所得・控除、ブラウザ環境などに起因して、計算結果と実際の税額が異なる場合があります。当サイトの利用により生じた損害について、運営者は法令上免責が認められない場合を除き、責任を負いません。
        </p>
        <p>
          当サイトから外部サイト（ふるさと納税ポータル、関係省庁の案内等）へリンクする場合があります。リンク先の内容・取引・個人情報の取り扱いは、各運営者の責任となります。
        </p>
        <p>
          当サイトの一部にはアフィリエイトリンクが含まれます。リンク経由の申込みにより運営者が報酬を受けることがありますが、掲載内容の中立性を損なう意図はありません。
        </p>
      </LegalSection>

      <LegalSection title="著作権">
        <p>
          当サイトに掲載する文章、デザイン、プログラム等の権利は運営者または正当な権利者に帰属します。無断での複製、転載、改変を禁止します。
        </p>
      </LegalSection>

      <LegalSection title="運営者情報">
        <p>
          個人の本名および番地・部屋番号は掲載していません。ご連絡はサイト内のお問い合わせフォームをご利用ください。
        </p>
        <dl className="divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white/70">
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-ink-500">サイト名</dt>
            <dd>{SITE.name}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-ink-500">運営形態</dt>
            <dd>{SITE.operatorType}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-ink-500">運営者名</dt>
            <dd>{SITE.operatorName}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-ink-500">所在地</dt>
            <dd>
              {SITE.operatorArea}
              <span className="mt-1 block text-ink-600">{SITE.operatorAddress}</span>
            </dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-ink-500">連絡先</dt>
            <dd>
              <a
                href={SITE.contactPath}
                className="text-cedar-800 underline decoration-cedar-300 underline-offset-2 hover:text-cedar-950"
              >
                お問い合わせフォーム
              </a>
              {hasContactEmail() ? (
                <>
                  <span className="mt-1 block">
                    専用メール：
                    <a
                      href={`mailto:${SITE.contactEmail}`}
                      className="text-cedar-800 underline decoration-cedar-300 underline-offset-2 hover:text-cedar-950"
                    >
                      {SITE.contactEmail}
                    </a>
                  </span>
                </>
              ) : (
                <span className="mt-1 block text-ink-600">
                  メールアドレスの公開は行っておりません。折り返しが必要な場合は、フォームに返信可能なアドレスをご記入ください。
                </span>
              )}
            </dd>
          </div>
        </dl>
      </LegalSection>
    </LegalPage>
  );
}
