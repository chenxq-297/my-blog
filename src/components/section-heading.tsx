type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-3">
        <span className="h-px w-10 bg-[var(--accent-cyan)]" />
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
          {eyebrow}
        </p>
      </div>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[var(--muted-soft)]">{description}</p>
    </div>
  );
}
