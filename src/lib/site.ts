/** サイト共通の運営者・連絡先（本名・番地は掲載しない） */
export const SITE = {
  name: "ふるさと納税 控除上限シミュレーター",
  operatorName: "Furusato Lab 運営事務局",
  operatorType: "個人（屋号による運営）",
  operatorArea: "日本国内",
  operatorAddress:
    "非公開（※お問い合わせはメールまたはフォームよりお願いいたします）",
  /** 専用メール。空のときはサイト内フォームを正規窓口とする */
  contactEmail: "",
  contactPath: "/contact",
} as const;

export function hasContactEmail(): boolean {
  return SITE.contactEmail.trim().length > 0;
}
