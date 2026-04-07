import type { ReactNode } from "react";
import { accentMap, type AccentKey } from "@/lib/site";
import { formatDate, cn } from "@/lib/utils";

type ArticleShellProps = {
  accent: AccentKey;
  eyebrow: string;
  title: string;
  summary: string;
  date: string;
  children: ReactNode;
};

export function ArticleShell({
  accent,
  eyebrow,
  title,
  summary,
  date,
  children,
}: ArticleShellProps) {
  const style = accentMap[accent];

  return (
    <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
      <header className="mb-14 rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-10">
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--accent-cyan)]" />
          <span className={cn("text-xs font-semibold uppercase tracking-[0.28em]", style.textClass)}>
            {eyebrow}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-dim)]">
          <span>{formatDate(date)}</span>
          <span className={cn("rounded-full border px-2.5 py-1", style.borderClass, style.textClass)}>
            {style.label}
          </span>
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-soft)]">{summary}</p>
      </header>
      <div className="content-prose">{children}</div>
    </article>
  );
}
