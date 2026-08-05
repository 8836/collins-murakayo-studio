import type { DriveEntry } from "./portfolio";

/**
 * Live read of the public Google Drive folder that acts as the portfolio CMS.
 *
 * Uses Drive's lightweight `embeddedfolderview` listing, which returns the full
 * folder contents as static HTML (no JS, no API key), so newly added files show
 * up on the site automatically.
 */
const FOLDER_ID = "1ihdR4k5vMaw4a30hM81IiKhFLuA6HItY";
const LISTING_URL = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#list`;

const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; entries: DriveEntry[] } | null = null;

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function parseFolderListing(html: string): DriveEntry[] {
  const entries: DriveEntry[] = [];
  const seen = new Set<string>();
  const blocks = html.split('class="flip-entry"').slice(1);

  for (const block of blocks) {
    const id = /id="entry-([-\w]{20,60})"/.exec(block)?.[1];
    const name = /flip-entry-title">([^<]+)</.exec(block)?.[1];
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    entries.push({
      id,
      name: decode(name).trim(),
      modified: decode(/flip-entry-last-modified"><div>([^<]*)</.exec(block)?.[1] ?? "").trim(),
    });
  }

  return entries;
}

export async function fetchDriveEntries(): Promise<DriveEntry[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.entries;

  try {
    const response = await fetch(LISTING_URL, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
    });
    if (!response.ok) {
      console.error(`Drive listing failed [${response.status}]: ${await response.text()}`);
      return cache?.entries ?? [];
    }
    const entries = parseFolderListing(await response.text());
    if (entries.length === 0) return cache?.entries ?? [];
    cache = { at: Date.now(), entries };
    return entries;
  } catch (error) {
    console.error("Drive listing error", error);
    return cache?.entries ?? [];
  }
}
