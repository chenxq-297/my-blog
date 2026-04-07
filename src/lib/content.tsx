import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { absoluteUrl, type AccentKey } from "@/lib/site";
import { sortByDateDescending } from "@/lib/utils";

const contentRoot = path.join(process.cwd(), "content");

const dateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Expected an ISO-like date string",
});

const accentSchema = z.enum(["cyan", "violet", "lime"]);

const baseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: dateSchema,
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  accent: accentSchema.optional().default("cyan"),
  tags: z.array(z.string()).optional().default([]),
});

const blogSchema = baseSchema.extend({
  category: z.string().default("Essay"),
  readingTime: z.string().optional(),
});

const travelSchema = baseSchema.extend({
  destination: z.string(),
  season: z.string(),
});

const noteSchema = baseSchema.extend({
  topic: z.string(),
});

const projectSchema = baseSchema.extend({
  stack: z.array(z.string()).optional().default([]),
  status: z.string().default("Selected"),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
});

type EntryBase = {
  slug: string;
  body: string;
  href: string;
  absoluteHref: string;
  accent: AccentKey;
  title: string;
  summary: string;
  date: string;
  featured: boolean;
  published: boolean;
  tags: string[];
};

export type BlogPost = EntryBase & z.infer<typeof blogSchema>;
export type TravelEntry = EntryBase & z.infer<typeof travelSchema>;
export type NoteEntry = EntryBase & z.infer<typeof noteSchema>;
export type ProjectEntry = EntryBase & z.infer<typeof projectSchema>;
export type AnyEntry = BlogPost | TravelEntry | NoteEntry | ProjectEntry;

async function readDirectoryEntries<T extends EntryBase>(
  folder: string,
  schema: z.ZodType<Omit<T, keyof EntryBase>>,
  hrefPrefix: string,
) {
  const directory = path.join(contentRoot, folder);
  const fileNames = await fs.readdir(directory);

  const entries = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const fullPath = path.join(directory, fileName);
        const source = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(source);
        const slug = fileName.replace(/\.mdx$/, "");
        const parsed = schema.parse(data);

        return {
          ...parsed,
          slug,
          body: content.trim(),
          href: `${hrefPrefix}/${slug}`,
          absoluteHref: absoluteUrl(`${hrefPrefix}/${slug}`),
        } as T;
      }),
  );

  return sortByDateDescending(entries.filter((entry) => entry.published));
}

export const getBlogPosts = cache(async () => {
  return readDirectoryEntries<BlogPost>("blog", blogSchema, "/blog");
});

export const getTravelEntries = cache(async () => {
  return readDirectoryEntries<TravelEntry>("travel", travelSchema, "/travel");
});

export const getNoteEntries = cache(async () => {
  return readDirectoryEntries<NoteEntry>("notes", noteSchema, "/notes");
});

export const getProjectEntries = cache(async () => {
  return readDirectoryEntries<ProjectEntry>("projects", projectSchema, "/projects");
});

export async function getAllEntries() {
  const [blog, travel, notes, projects] = await Promise.all([
    getBlogPosts(),
    getTravelEntries(),
    getNoteEntries(),
    getProjectEntries(),
  ]);

  return sortByDateDescending<AnyEntry>([...blog, ...travel, ...notes, ...projects]);
}

function findEntryOrThrow<T extends AnyEntry>(entries: T[], slug: string) {
  const entry = entries.find((item) => item.slug === slug);

  if (!entry) {
    throw new Error(`Entry not found for slug: ${slug}`);
  }

  return entry;
}

export async function getBlogPost(slug: string) {
  return findEntryOrThrow(await getBlogPosts(), slug);
}

export async function getTravelEntry(slug: string) {
  return findEntryOrThrow(await getTravelEntries(), slug);
}

export async function getNoteEntry(slug: string) {
  return findEntryOrThrow(await getNoteEntries(), slug);
}

export async function getProjectEntry(slug: string) {
  return findEntryOrThrow(await getProjectEntries(), slug);
}

export async function renderEntryMdx(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: {
      h2: (props) => (
        <h2 className="mt-12 border-t border-[var(--line)] pt-6 text-2xl font-semibold tracking-tight text-white" {...props} />
      ),
      h3: (props) => (
        <h3 className="mt-10 text-xl font-semibold tracking-tight text-white" {...props} />
      ),
      p: (props) => (
        <p className="my-5 text-[1.05rem] leading-8 text-[var(--muted-strong)]" {...props} />
      ),
      ul: (props) => <ul className="my-5 list-disc space-y-3 pl-6 text-[var(--muted-strong)]" {...props} />,
      ol: (props) => <ol className="my-5 list-decimal space-y-3 pl-6 text-[var(--muted-strong)]" {...props} />,
      li: (props) => <li className="pl-1" {...props} />,
      a: (props) => <a className="text-[var(--accent-cyan)] underline decoration-[var(--line-strong)] underline-offset-4" {...props} />,
      blockquote: (props) => (
        <blockquote
          className="my-8 border-l-2 border-[var(--accent-violet)] bg-[color:rgba(183,107,255,0.08)] px-6 py-4 text-[var(--muted-strong)]"
          {...props}
        />
      ),
      code: (props) => (
        <code
          className="rounded-[0.45rem] bg-[color:rgba(255,255,255,0.06)] px-2 py-1 font-mono text-[0.92rem] text-[var(--accent-lime)]"
          {...props}
        />
      ),
      pre: (props) => (
        <pre
          className="my-8 overflow-x-auto rounded-[1rem] border border-[var(--line)] bg-[var(--panel-strong)] p-5 text-sm text-[var(--muted-soft)]"
          {...props}
        />
      ),
    },
  });

  return content;
}
