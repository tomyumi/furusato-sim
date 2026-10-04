import type { ReactNode } from "react";

/** レイアウト用のサーバーラッパー。クライアント境界にしない（ページ全体のハイドレーションを避ける）。 */
export function ClientShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
}
