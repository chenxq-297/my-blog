export default function AdminAboutPlaceholderPage() {
  return (
    <section className="space-y-4 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        About page
      </h1>
      <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
        This route is ready for the configurable About editor in the following task.
      </p>
    </section>
  );
}
