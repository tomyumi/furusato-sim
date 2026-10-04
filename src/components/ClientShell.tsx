"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col" suppressHydrationWarning>
      {mounted ? children : null}
    </div>
  );
}
