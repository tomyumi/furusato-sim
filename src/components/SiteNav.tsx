"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/#simulator", label: "控除上限額シミュレーション", match: "/" },
  { href: "/guides", label: "限度額の解説コラム", match: "/guides" },
  { href: "/contact", label: "お問い合わせ", match: "/contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="主要メニュー">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        {NAV.map((item) => {
          const current =
            item.match === "/"
              ? pathname === "/"
              : pathname === item.match || pathname.startsWith(`${item.match}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`no-underline transition hover:text-cedar-700 ${
                  current ? "font-semibold text-cedar-800" : "text-ink-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
