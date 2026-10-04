"use client";

import { useClientReady } from "@/lib/useClientReady";
import type { ReactNode } from "react";

/** サーバーHTMLとハイドレーション初回を揃える。マウント後だけ children を描画する。 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const ready = useClientReady();
  if (!ready) return fallback;
  return children;
}
