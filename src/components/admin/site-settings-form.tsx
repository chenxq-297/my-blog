import { updateSiteSettings } from "@/features/site-config/actions";
import type { SiteSettings } from "@/features/site-config/schema";

type SiteSettingsFormProps = {
  settings: SiteSettings;
};

const toNumber = (value: FormDataEntryValue | null) => {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

const toString = (value: FormDataEntryValue | null) => String(value ?? "").trim();

const toBoolean = (formData: FormData, key: string) => {
  const values = formData.getAll(key).map((entry) => String(entry));
  return values.some((entry) => entry === "true" || entry === "on" || entry === "1");
};

const readRows = (formData: FormData, prefix: "navigation" | "socialLinks") => {
  const indexes = new Set<number>();

  for (const key of formData.keys()) {
    if (!key.startsWith(`${prefix}.`)) {
      continue;
    }

    const [, maybeIndex] = key.split(".");
    const index = Number(maybeIndex);

    if (Number.isInteger(index)) {
      indexes.add(index);
    }
  }

  return [...indexes].sort((a, b) => a - b).map((index) => ({
    label: toString(formData.get(`${prefix}.${index}.label`)),
    href: toString(formData.get(`${prefix}.${index}.href`)),
    sortOrder: toNumber(formData.get(`${prefix}.${index}.sortOrder`)),
    isVisible: toBoolean(formData, `${prefix}.${index}.isVisible`),
  }));
};

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const submit = async (formData: FormData) => {
    "use server";

    await updateSiteSettings({
      siteName: toString(formData.get("siteName")),
      role: toString(formData.get("role")),
      location: toString(formData.get("location")),
      title: toString(formData.get("title")),
      description: toString(formData.get("description")),
      url: toString(formData.get("url")),
      email: toString(formData.get("email")),
      intro: toString(formData.get("intro")),
      status: toString(formData.get("status")),
      locale: toString(formData.get("locale")),
      navigation: readRows(formData, "navigation"),
      socialLinks: readRows(formData, "socialLinks"),
    });
  };

  return (
    <form
      action={submit}
      className="space-y-8 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Site settings</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
          Update the global profile copy and shared links used across the public pages.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Site name</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.siteName} name="siteName" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Role</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.role} name="role" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Location</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.location} name="location" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Locale</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.locale} name="locale" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Title</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.title} name="title" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Description</span>
          <textarea className="min-h-28 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.description} name="description" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>URL</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.url} name="url" required type="url" />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Email</span>
          <input className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.email} name="email" required type="email" />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Intro</span>
          <textarea className="min-h-28 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.intro} name="intro" required />
        </label>
        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Status</span>
          <textarea className="min-h-24 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]" defaultValue={settings.status} name="status" required />
        </label>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Navigation</h2>
        <div className="space-y-4">
          {settings.navigation.map((item, index) => (
            <div key={`navigation-${index}-${item.href}`} className="grid gap-4 rounded-2xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.7)] p-4 md:grid-cols-12">
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-3">
                <span>Label</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.label} name={`navigation.${index}.label`} required />
              </label>
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-5">
                <span>Href</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.href} name={`navigation.${index}.href`} required />
              </label>
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <span>Sort order</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.sortOrder} min={0} name={`navigation.${index}.sortOrder`} required type="number" />
              </label>
              <label className="flex items-end gap-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <input defaultChecked={item.isVisible} name={`navigation.${index}.isVisible`} type="checkbox" value="true" />
                <span>Visible</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Social links</h2>
        <div className="space-y-4">
          {settings.socialLinks.map((item, index) => (
            <div key={`social-${index}-${item.href}`} className="grid gap-4 rounded-2xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.7)] p-4 md:grid-cols-12">
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-3">
                <span>Label</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.label} name={`socialLinks.${index}.label`} required />
              </label>
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-5">
                <span>Href</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.href} name={`socialLinks.${index}.href`} required />
              </label>
              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <span>Sort order</span>
                <input className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]" defaultValue={item.sortOrder} min={0} name={`socialLinks.${index}.sortOrder`} required type="number" />
              </label>
              <label className="flex items-end gap-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <input defaultChecked={item.isVisible} name={`socialLinks.${index}.isVisible`} type="checkbox" value="true" />
                <span>Visible</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <button
        className="inline-flex items-center rounded-full border border-[color:rgba(0,244,254,0.34)] bg-[color:rgba(0,244,254,0.1)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-cyan)] transition-colors hover:bg-[color:rgba(0,244,254,0.18)]"
        type="submit"
      >
        Save site settings
      </button>
    </form>
  );
}

