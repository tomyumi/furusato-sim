import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ふるさと納税 控除上限シミュレーター",
  description:
    "会社員・副業・個人事業主向け。給与・事業所得・所得控除・住宅ローン控除を考慮したふるさと納税の控除上限額の目安計算",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
