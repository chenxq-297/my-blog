import { updateHomeSections } from "@/features/home-sections/actions";
import {
  homeSectionKeySchema,
  homeSectionSourceCollectionSchema,
  type HomeSection,
} from "@/features/home-sections/schema";

type HomeSectionsFormProps = {
  sections: HomeSection[];
};

const toString = (value: FormDataEntryValue | null) => String(value ?? "").trim();

const toNullableString = (value: FormDataEntryValue | null) => {
  const normalized = toString(value);
  return normalized.length > 0 ? normalized : null;
};

const toNumber = (value: FormDataEntryValue | null) => {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

const toNullablePositiveNumber = (value: FormDataEntryValue | null) => {
  const normalized = toString(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const toBoolean = (formData: FormData, key: string) => {
  const values = formData.getAll(key).map((entry) => String(entry));
  return values.some((entry) => entry === "true" || entry === "on" || entry === "1");
};

const readSections = (formData: FormData) => {
  const indexes = new Set<number>();

  for (const key of formData.keys()) {
    if (!key.startsWith("sections.")) {
      continue;
    }

    const [, maybeIndex] = key.split(".");
    const index = Number(maybeIndex);
    if (Number.isInteger(index)) {
      indexes.add(index);
    }
  }

  return [...indexes].sort((a, b) => a - b).map((index) => {
    const sourceCollectionValue = toString(formData.get(`sections.${index}.sourceCollection`));

    return {
      key: homeSectionKeySchema.parse(toString(formData.get(`sections.${index}.key`))),
      eyebrow: toNullableString(formData.get(`sections.${index}.eyebrow`)),
      title: toString(formData.get(`sections.${index}.title`)),
      description: toNullableString(formData.get(`sections.${index}.description`)),
      isVisible: toBoolean(formData, `sections.${index}.isVisible`),
      sortOrder: toNumber(formData.get(`sections.${index}.sortOrder`)),
      sourceCollection: sourceCollectionValue
        ? homeSectionSourceCollectionSchema.parse(sourceCollectionValue)
        : null,
      maxItems: toNullablePositiveNumber(formData.get(`sections.${index}.maxItems`)),
    };
  });
};

export function HomeSectionsForm({ sections }: HomeSectionsFormProps) {
  const submit = async (formData: FormData) => {
    "use server";

    await updateHomeSections(readSections(formData));
  };

  return (
    <form
      action={submit}
      className="space-y-8 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Home sections</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
          Control homepage section copy, ordering, limits, and visibility without changing content files.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <article
            key={`${section.key}-${index}`}
            className="space-y-4 rounded-2xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.7)] p-5"
          >
            <header className="space-y-2">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{section.key}</h2>
              <p className="text-sm text-[var(--muted-soft)]">
                Current: {section.eyebrow ?? "(no eyebrow)"} / {section.title} /{" "}
                {section.description ?? "(no description)"} / {section.isVisible ? "Visible" : "Hidden"}
              </p>
            </header>

            <input name={`sections.${index}.key`} type="hidden" value={section.key} />
            <input
              name={`sections.${index}.sourceCollection`}
              type="hidden"
              value={section.sourceCollection ?? ""}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-[var(--muted-soft)]">
                <span>Eyebrow ({section.key})</span>
                <input
                  aria-label={`Eyebrow (${section.key})`}
                  className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]"
                  defaultValue={section.eyebrow ?? ""}
                  name={`sections.${index}.eyebrow`}
                />
              </label>

              <label className="space-y-2 text-sm text-[var(--muted-soft)]">
                <span>Title ({section.key})</span>
                <input
                  aria-label={`Title (${section.key})`}
                  className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]"
                  defaultValue={section.title}
                  name={`sections.${index}.title`}
                  required
                />
              </label>

              <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <span>Description ({section.key})</span>
                <textarea
                  aria-label={`Description (${section.key})`}
                  className="min-h-24 w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]"
                  defaultValue={section.description ?? ""}
                  name={`sections.${index}.description`}
                />
              </label>

              <label className="space-y-2 text-sm text-[var(--muted-soft)]">
                <span>Sort order ({section.key})</span>
                <input
                  aria-label={`Sort order (${section.key})`}
                  className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]"
                  defaultValue={section.sortOrder}
                  min={0}
                  name={`sections.${index}.sortOrder`}
                  required
                  type="number"
                />
              </label>

              <label className="space-y-2 text-sm text-[var(--muted-soft)]">
                <span>Max items ({section.key})</span>
                <input
                  aria-label={`Max items (${section.key})`}
                  className="w-full rounded-lg border border-[var(--line)] bg-[color:rgba(7,10,16,0.85)] px-3 py-2 text-[var(--foreground)]"
                  defaultValue={section.maxItems ?? ""}
                  min={1}
                  name={`sections.${index}.maxItems`}
                  type="number"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--muted-soft)] md:col-span-2">
                <input
                  aria-label={`Visible (${section.key})`}
                  defaultChecked={section.isVisible}
                  name={`sections.${index}.isVisible`}
                  type="checkbox"
                  value="true"
                />
                <span>Visible ({section.key})</span>
              </label>
            </div>
          </article>
        ))}
      </div>

      <button
        className="inline-flex items-center rounded-full border border-[color:rgba(0,244,254,0.34)] bg-[color:rgba(0,244,254,0.1)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-cyan)] transition-colors hover:bg-[color:rgba(0,244,254,0.18)]"
        type="submit"
      >
        Save home sections
      </button>
    </form>
  );
}
