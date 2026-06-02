"use client";

import { useEffect, useRef } from "react";

const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

export default function AutoUpdate() {
  const initialVersion = useRef<number | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const url = `${base}/version.json`;

    async function check() {
      try {
        const res = await fetch(`${url}?_=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const v = data.v as number;
        if (initialVersion.current === null) {
          initialVersion.current = v;
          return;
        }
        if (v > initialVersion.current) {
          initialVersion.current = v;
          if (document.hidden) {
            document.addEventListener("visibilitychange", () => location.reload(), { once: true });
          } else {
            location.reload();
          }
        }
      } catch {}
    }

    check();
    const timer = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return null;
}
