import { SiteNav } from "@/components/SiteNav";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="/" className="min-w-0 no-underline" suppressHydrationWarning>
          <span className="kicker block">FURUSATO LAB</span>
          <span className="mt-1 block truncate font-display text-lg font-semibold leading-tight text-ink-950">
            {SITE.name}
          </span>
        </a>
        <SiteNav />
      </div>
    </header>
  );
}
