import Link from "next/link";
import { getSiteSettings } from "@/features/site-config/queries";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const navigation = settings.navigation.filter((item) => item.isVisible);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:rgba(10,14,20,0.82)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-5 py-4 sm:px-8">
        <Link className="font-sans text-lg font-bold uppercase tracking-[0.22em] text-[var(--accent-cyan)]" href="/">
          {settings.siteName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className="text-sm uppercase tracking-[0.18em] text-[var(--muted-soft)] transition-colors hover:text-[var(--accent-cyan)]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(0,244,254,0.28)] bg-[color:rgba(0,244,254,0.08)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-cyan)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-lime)] shadow-[0_0_14px_rgba(151,255,124,0.8)]" />
          Independent logbook
        </div>
      </div>
    </header>
  );
}
