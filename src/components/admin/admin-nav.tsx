import Link from "next/link";

type AdminNavProps = {
  email: string;
  name: string;
};

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog posts" },
  { href: "/admin/site", label: "Site settings" },
  { href: "/admin/home", label: "Home sections" },
  { href: "/admin/about", label: "About page" },
] as const;

export const AdminNav = ({ email, name }: AdminNavProps) => {
  return (
    <header className="border-b border-[var(--line)] bg-black/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-lime)]">
              Admin console
            </p>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">{name}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--muted-strong)]">{email}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-dim)]">Owner</p>
          </div>
        </div>
        <nav aria-label="Admin sections" className="flex flex-wrap gap-3">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-sm text-[var(--muted-strong)] transition hover:border-[var(--accent-cyan)] hover:text-[var(--foreground)]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
