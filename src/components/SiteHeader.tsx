import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-ink-100 bg-white/80 backdrop-blur-md" suppressHydrationWarning>
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="min-w-0 no-underline" suppressHydrationWarning>
          <p className="kicker">FURUSATO LAB</p>
          <p className="mt-1 truncate font-display text-lg font-semibold leading-tight text-ink-950">
            {SITE.name}
          </p>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
