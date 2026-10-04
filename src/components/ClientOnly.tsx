"use client";

import { useEffect, useState, type ReactNode } from "react";

/** サーバーHTMLと、拡張機能等が付与する data-cursor-ref 等を突き合わせない */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;
  return children;
}
