import { updateAboutPage } from "@/features/about/actions";
import type { AboutPage } from "@/features/about/schema";

type AboutFormProps = {
  aboutPage: AboutPage;
};

const toString = (value: FormDataEntryValue | null) => String(value ?? "").trim();

const toPrinciples = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

export function AboutForm({ aboutPage }: AboutFormProps) {
  const submit = async (formData: FormData) => {
    "use server";

    await updateAboutPage({
      eyebrow: toString(formData.get("eyebrow")),
      title: toString(formData.get("title")),
      description: toString(formData.get("description")),
      profileHeading: toString(formData.get("profileHeading")),
      profileBody: toString(formData.get("profileBody")),
      profileBodySecondary: toString(formData.get("profileBodySecondary")),
      focusHeading: toString(formData.get("focusHeading")),
      focusBody: toString(formData.get("focusBody")),
      principlesHeading: toString(formData.get("principlesHeading")),
      principles: toPrinciples(formData.get("principles")),
    });
  };

  return (
    <form
      action={submit}
      className="space-y-8 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">About page</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
          Edit the profile, current focus, and working principles shown on the public About page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Eyebrow</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.eyebrow}
            name="eyebrow"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Profile heading</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.profileHeading}
            name="profileHeading"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Title</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.title}
            name="title"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Description</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.description}
            name="description"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Profile body</span>
          <textarea
            className="min-h-40 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.profileBody}
            name="profileBody"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Profile body secondary</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.profileBodySecondary}
            name="profileBodySecondary"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Focus heading</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.focusHeading}
            name="focusHeading"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Principles heading</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.principlesHeading}
            name="principlesHeading"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Focus body</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.focusBody}
            name="focusBody"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Principles</span>
          <textarea
            className="min-h-36 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={aboutPage.principles.join("\n")}
            name="principles"
            required
          />
        </label>
      </div>

      <button
        className="inline-flex items-center rounded-full border border-[color:rgba(0,244,254,0.34)] bg-[color:rgba(0,244,254,0.1)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-cyan)] transition-colors hover:bg-[color:rgba(0,244,254,0.18)]"
        type="submit"
      >
        Save about page
      </button>
    </form>
  );
}
