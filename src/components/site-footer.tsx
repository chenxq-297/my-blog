import Link from "next/link";
import { getSiteSettings } from "@/features/site-config/queries";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socialLinks = settings.socialLinks.filter((item) => item.isVisible);

  return (
    <footer className="border-t border-[var(--line)] bg-[color:rgba(7,10,16,0.92)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--accent-cyan)]">
            Signal Archive
          </p>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted-soft)]">{settings.description}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-dim)]">
            {settings.location} · {settings.role}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {socialLinks.map((item) => (
            <Link
              key={item.href}
              className="text-xs uppercase tracking-[0.22em] text-[var(--muted-soft)] transition-colors hover:text-[var(--accent-violet)]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

