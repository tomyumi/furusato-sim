"use client";

import { useEffect, useState } from "react";

/**
 * サーバー描画とハイドレーション初回は必ず false。
 * useEffect のあと（マウント完了後）だけ true。
 */
export function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}
