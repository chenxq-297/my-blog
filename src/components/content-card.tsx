import Link from "next/link";
import { accentMap, type AccentKey } from "@/lib/site";
import { formatDate, cn } from "@/lib/utils";

type ContentCardProps = {
  href: string;
  title: string;
  summary: string;
  date: string;
  accent: AccentKey;
  meta: string;
  tags?: string[];
};

export function ContentCard({
  href,
  title,
  summary,
  date,
  accent,
  meta,
  tags = [],
}: ContentCardProps) {
  const style = accentMap[accent];

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col justify-between rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--line-strong)]",
        style.glowClass,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.26em]",
              style.textClass,
              style.borderClass,
              style.surfaceClass,
            )}
          >
            {meta}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-dim)]">
            {formatDate(date)}
          </span>
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
        <p className="line-clamp-4 text-sm leading-7 text-[var(--muted-soft)]">{summary}</p>
      </div>
      <div className="mt-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em]", style.textClass)}>
          Read entry
          <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
