/**
 * Reads the markdown files Decap CMS commits into `content/`.
 *
 * Server-only: it touches the filesystem, so it must not be imported from a
 * Client Component. The content pages are statically rendered, which means
 * these functions run at build time and the result is baked into the HTML.
 * That is the point of a git-backed CMS: saving in the CMS pushes a commit,
 * the host rebuilds, and the new content ships with the build.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PlaceholderItem } from "@/lib/site";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Normalised shape every card renders from, whatever collection it came from. */
export type CardItem = {
  key: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  date: string | null;
  image: string | null;
  href: string | null;
};

type Entry = { slug: string; data: Record<string, unknown> };

function readCollection(folder: string): Entry[] {
  const dir = path.join(CONTENT_ROOT, folder);

  let names: string[];
  try {
    names = fs.readdirSync(dir);
  } catch {
    // The folder does not exist until the first entry is saved. An empty tab
    // is the correct result here, not a failed build.
    return [];
  }

  return names
    .filter((name) => /\.(md|markdown)$/i.test(name))
    .map((name) => {
      const raw = fs.readFileSync(path.join(dir, name), "utf8");
      const { data } = matter(raw);
      return {
        slug: name.replace(/\.(md|markdown)$/i, ""),
        data: (data ?? {}) as Record<string, unknown>,
      };
    });
}

/**
 * YAML parses an unquoted ISO timestamp into a Date rather than a string, so
 * the `datetime` widget's output arrives as either depending on how Decap
 * quoted it. Normalise both to an ISO string.
 */
function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function toText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Newest first. Undated entries sort last instead of vanishing. */
function byDateDesc(a: CardItem, b: CardItem): number {
  const left = a.date ? Date.parse(a.date) : Number.NEGATIVE_INFINITY;
  const right = b.date ? Date.parse(b.date) : Number.NEGATIVE_INFINITY;
  if (Number.isNaN(left) || Number.isNaN(right)) return 0;
  return right - left;
}

/** content/gallery -- the Gallery collection, shown on the Art tab. */
export function getGallery(): CardItem[] {
  return readCollection("gallery")
    .map(({ slug, data }) => ({
      key: slug,
      title: toText(data.title) ?? slug,
      subtitle: null,
      body: toText(data.caption),
      date: toIsoDate(data.date),
      image: toText(data.image),
      href: null,
    }))
    .sort(byDateDesc);
}

/** content/reading-recs -- the Reading Recs collection, shown on Reading. */
export function getReadingRecs(): CardItem[] {
  return readCollection("reading-recs")
    .map(({ slug, data }) => ({
      key: slug,
      title: toText(data.title) ?? slug,
      subtitle: null,
      body: toText(data.take),
      date: toIsoDate(data.date),
      image: null,
      href: toText(data.link),
    }))
    .sort(byDateDesc);
}

/**
 * Adapts the hand-written entries in lib/site.ts to the same card shape. Used
 * by the two tabs that have no CMS collection yet.
 */
export function fromPlaceholders(items: PlaceholderItem[]): CardItem[] {
  return items.map((item) => ({
    key: item.id,
    title: item.title,
    subtitle: null,
    body: item.description,
    date: null,
    image: null,
    href: item.href ?? null,
  }));
}

/**
 * Renders a date for display, with an explicit locale and UTC timezone so the
 * build and the browser cannot disagree about it.
 */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
