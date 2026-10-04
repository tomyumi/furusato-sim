"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex-1" suppressHydrationWarning />;
  }

  return <div className="flex-1">{children}</div>;
}
