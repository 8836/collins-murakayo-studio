/**
 * Pure, client-safe portfolio domain logic.
 *
 * The Google Drive folder is treated as a live CMS: raw file entries are
 * fetched server-side, then grouped and enriched here. Adding new files to the
 * Drive folder makes new projects (or new assets on existing projects) appear
 * automatically — no code edits required.
 */

import { CURATED_PROJECTS } from "./portfolio.curated";

export type DriveEntry = {
  id: string;
  name: string;
  modified: string;
};

export type AssetKind =
  | "image"
  | "vector-source"
  | "raster-source"
  | "layout-source"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "other";

export type Asset = {
  id: string;
  name: string;
  ext: string;
  kind: AssetKind;
  software: string | null;
  previewUrl: string;
  fullUrl: string;
  downloadUrl: string;
  viewUrl: string;
  isImage: boolean;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  category: string;
  discipline: string;
  summary: string;
  objectives: string[];
  challenge: string;
  research: string;
  process: string[];
  solution: string;
  services: string[];
  deliverables: string[];
  keywords: string[];
  cover: Asset | null;
  images: Asset[];
  files: Asset[];
  assetCount: number;
};

/* ------------------------------------------------------------------ assets */

const EXT_META: Record<string, { kind: AssetKind; software: string | null }> = {
  jpg: { kind: "image", software: null },
  jpeg: { kind: "image", software: null },
  png: { kind: "image", software: null },
  webp: { kind: "image", software: null },
  gif: { kind: "image", software: null },
  tif: { kind: "image", software: null },
  tiff: { kind: "image", software: null },
  svg: { kind: "vector-source", software: "SVG" },
  ai: { kind: "vector-source", software: "Adobe Illustrator" },
  eps: { kind: "vector-source", software: "Encapsulated PostScript" },
  cdr: { kind: "vector-source", software: "CorelDRAW" },
  afdesign: { kind: "vector-source", software: "Affinity Designer" },
  psd: { kind: "raster-source", software: "Adobe Photoshop" },
  indd: { kind: "layout-source", software: "Adobe InDesign" },
  idml: { kind: "layout-source", software: "Adobe InDesign" },
  pdf: { kind: "document", software: "Adobe Acrobat" },
  doc: { kind: "document", software: "Microsoft Word" },
  docx: { kind: "document", software: "Microsoft Word" },
  xls: { kind: "spreadsheet", software: "Microsoft Excel" },
  xlsx: { kind: "spreadsheet", software: "Microsoft Excel" },
  csv: { kind: "spreadsheet", software: "Microsoft Excel" },
  ppt: { kind: "presentation", software: "Microsoft PowerPoint" },
  pptx: { kind: "presentation", software: "Microsoft PowerPoint" },
  zip: { kind: "archive", software: "Archive" },
  rar: { kind: "archive", software: "Archive" },
};

export function extensionOf(name: string): string {
  const match = /\.([a-z0-9]{1,10})$/i.exec(name.trim());
  return match ? match[1]!.toLowerCase() : "";
}

export function baseNameOf(name: string): string {
  const ext = extensionOf(name);
  return ext ? name.slice(0, -(ext.length + 1)) : name;
}

export function toAsset(entry: DriveEntry): Asset {
  const ext = extensionOf(entry.name);
  const meta = EXT_META[ext] ?? { kind: "other" as AssetKind, software: null };
  return {
    id: entry.id,
    name: entry.name,
    ext,
    kind: meta.kind,
    software: meta.software,
    previewUrl: `https://drive.google.com/thumbnail?id=${entry.id}&sz=w1200`,
    fullUrl: `https://drive.google.com/thumbnail?id=${entry.id}&sz=w2000`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${entry.id}`,
    viewUrl: `https://drive.google.com/file/d/${entry.id}/view`,
    isImage: meta.kind === "image",
  };
}

/* ------------------------------------------------------- grouping heuristics */

/** Strip export suffixes so `Box Design-01.jpg` and `Box Design-03.jpg` group. */
function groupKey(name: string): string {
  let base = baseNameOf(name);
  base = base.replace(/[_\s-]*artboard\s*\d+$/i, "");
  base = base.replace(/\s*\(\d+\)\s*$/, "");
  base = base.replace(/[-_\s]+v?\d{1,3}$/i, "");
  base = base.replace(/[-_\s]+(edit|final|copy|approved|alte|alt)$/i, "");
  base = base.replace(/\s+/g, " ").trim();
  return base.toLowerCase();
}

type Rule = {
  test: RegExp;
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  discipline: string;
  summary: string;
  services: string[];
  keywords?: string[];
  /** Explicit year override when the filenames don't carry a reliable date. */
  year?: string;
};

const RULES: Rule[] = [
  {
    test: /^china village/i,
    slug: "china-village-identity-system",
    title: "China Village — Operational Identity System",
    client: "China Village",
    industry: "Hospitality & Restaurants",
    category: "Corporate Identity",
    discipline: "Brand Identity & Business Systems",
    summary:
      "A complete operational identity: branded invoices, delivery notes, gate passes, receipts and gift vouchers built as one coherent document system.",
    services: ["Corporate Identity", "Stationery Design", "Print Production", "Document Systems"],
    keywords: ["stationery", "invoice", "receipt", "voucher", "restaurant"],
  },
  {
    test: /^madaraka/i,
    slug: "madaraka-day-campaign",
    title: "Madaraka Day — National Holiday Campaign",
    client: "Retail Campaign",
    industry: "Retail & Commerce",
    category: "Marketing Campaigns",
    discipline: "Campaign Design",
    summary:
      "A social-first holiday campaign built on a tight typographic system that stays legible at feed scale while carrying national colour cues.",
    services: ["Campaign Design", "Social Media Design", "Art Direction"],
    keywords: ["holiday", "campaign", "social", "kenya"],
  },
  {
    test: /^(cover art|vinyl record)/i,
    slug: "album-artwork-vinyl-series",
    title: "Vinyl & Album Artwork Series",
    year: "2026",
    client: "Independent Artists",
    industry: "Music & Entertainment",
    category: "Album Artwork",
    discipline: "Art Direction & Illustration",
    summary:
      "Album covers and vinyl mockups treated as editorial objects — composition, texture and type working together at 12 inches and at thumbnail size.",
    services: ["Album Artwork", "Art Direction", "Mockup Visualisation"],
    keywords: ["album", "vinyl", "music", "cover"],
  },
  {
    test: /^(alimurax|tweeps)/i,
    slug: "logo-collections",
    title: "Client Logo Exploration Collections",
    year: "2025",
    client: "Alimurax Insurance Agency & others",
    industry: "Insurance & Professional Services",
    category: "Logo & Identity",
    discipline: "Logo Systems & Marks",
    summary:
      "Full exploration suites for client identity briefs — multiple mark routes, lockups and palette directions presented as one comparable collection.",
    services: ["Logo Design", "Identity Exploration", "Brand Guidelines"],
    keywords: ["logo", "mark", "identity", "insurance", "collection"],
  },
  {
    test: /^(feelings|kamal|saave)/i,
    slug: "artist-single-covers",
    title: "Artist Single & Release Covers",
    client: "Independent Artists",
    industry: "Music & Entertainment",
    category: "Album Artwork",
    discipline: "Cover Art & Typography",
    summary:
      "Single-release covers built for streaming platforms, where the whole idea has to land inside a 300-pixel square.",
    services: ["Cover Art", "Typography", "Digital Release Assets"],
    keywords: ["single", "release", "streaming", "cover"],
  },
  {
    test: /^edits-/i,
    slug: "retouching-series",
    title: "Retouching & Post-Production Series",
    client: "Studio Work",
    industry: "Photography",
    category: "Photography",
    discipline: "Photo Retouching",
    summary:
      "A retouching series: colour grading, cleanup and compositing prepared for both print and social delivery.",
    services: ["Photo Retouching", "Colour Grading", "Compositing"],
    keywords: ["retouch", "photography", "post production"],
  },
  {
    test: /^whatsapp image/i,
    slug: "field-documentation",
    title: "Field & Production Documentation",
    year: "2025",
    client: "Various",
    industry: "Photography",
    category: "Photography",
    discipline: "Documentary Photography",
    summary:
      "On-site documentation of installed work — signage, large format and branded environments captured in their real context.",
    services: ["Photography", "Production Documentation"],
    keywords: ["photography", "install", "documentation"],
  },
  {
    test: /^lorry mock up/i,
    slug: "fleet-vehicle-branding",
    title: "Fleet & Vehicle Branding",
    client: "Logistics Client",
    industry: "Transport & Logistics",
    category: "Large Format",
    discipline: "Environmental Branding",
    summary:
      "Vehicle livery designed as moving large-format media: readable at distance, at speed, and from every approach angle.",
    services: ["Vehicle Branding", "Large Format", "Mockup Visualisation"],
    keywords: ["vehicle", "livery", "fleet", "large format"],
  },
  {
    test: /^box design/i,
    slug: "packaging-box-system",
    title: "Packaging — Structural Box System",
    client: "Consumer Goods",
    industry: "Consumer Packaged Goods",
    category: "Packaging",
    discipline: "Packaging Design",
    summary:
      "Packaging designed from the dieline out, with panel hierarchy that survives stacking, shelving and handling.",
    services: ["Packaging Design", "Dieline Artwork", "Print Production"],
    keywords: ["packaging", "box", "dieline", "retail"],
  },
  {
    test: /^(all branding poster|all services|dtf poster|cnc poster|large format|launch posters|poster clip|invitation)/i,
    slug: "print-large-format",
    title: "Print & Large Format Collection",
    client: "Various",
    industry: "Print & Signage",
    category: "Print Design",
    discipline: "Print & Large Format",
    summary:
      "Posters, invitations and large-format artwork built on a strict grid so hierarchy holds from A6 to billboard scale.",
    services: ["Print Design", "Large Format", "Prepress"],
    keywords: ["poster", "print", "billboard", "large format", "invitation"],
  },
  {
    test: /^(screenshot)/i,
    slug: "signage-installation",
    title: "Signage & Installation Record",
    year: "2025",
    client: "Great Nairobi East College & others",
    industry: "Education, Retail & Signage",
    category: "Print Design",
    discipline: "Signage & Large Format Install",
    summary:
      "Fabricated signage and large-format branding photographed on site — artwork drawn for the machine, the substrate and the final viewing distance.",
    services: ["Signage Design", "Large Format", "Installation Support"],
    keywords: ["signage", "install", "large format", "fabrication", "site"],
  },
  {
    test: /^(20 percent|special offer|offers approved|happy new month|father's day|eid ul adha|grand opening|hi cousins|customer service|cv water|scan qr)/i,
    slug: "retail-marketing-system",
    title: "Retail Marketing & Promotions System",
    client: "Various Retail",
    industry: "Retail & Commerce",
    category: "Social Media",
    discipline: "Marketing Design",
    summary:
      "A repeatable promotions kit — offers, greetings, openings and QR-driven activations — running off one type and colour system.",
    services: ["Marketing Design", "Social Media Design", "Promotional Campaigns"],
    keywords: ["promotion", "offer", "social", "retail", "qr"],
  },
];

const FALLBACK: Omit<Rule, "test" | "slug" | "title"> = {
  client: "Selected Work",
  industry: "Multidisciplinary",
  category: "Creative Direction",
  discipline: "Visual Communication",
  summary:
    "Selected visual work spanning identity, marketing and production design across sectors.",
  services: ["Graphic Design", "Art Direction"],
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

const NOISE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function titleCase(value: string): string {
  return value
    .split(" ")
    .map((word) => (word.length > 2 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function yearFrom(entries: DriveEntry[]): string {
  const years = entries
    .map((entry) => /(20\d{2})/.exec(entry.name)?.[1] ?? /(20\d{2})/.exec(entry.modified)?.[1])
    .filter(Boolean) as string[];
  if (years.length > 0) return years.sort().at(-1)!;
  return "2025";
}

function narrative(rule: { category: string; client: string; discipline: string }) {
  return {
    objectives: [
      `Give ${rule.client} a visual system that reads as considered, not decorated.`,
      "Hold one hierarchy across every format and production method.",
      "Make the assets reusable by non-designers without the system breaking.",
    ],
    challenge: `${rule.category} work rarely fails on aesthetics — it fails on consistency. The brief needed a system precise enough to survive real production constraints, multiple formats and hands other than mine.`,
    research: "Audited the existing material, the competitive set and the production realities — substrate, print method, viewing distance and platform crops — before drawing anything.",
    process: [
      "Audit & inventory of existing material and production constraints",
      "Grid, type scale and colour discipline defined first",
      "Concept sketches, then tight iteration on the two strongest routes",
      "Production artwork, prepress checks and mockup validation",
      "Handover kit with source files and usage notes",
    ],
    solution: `The final ${rule.discipline.toLowerCase()} system is deliberately restrained: a single grid, a tight type scale and controlled use of colour, so the work carries authority without shouting.`,
  };
}

/** Group raw Drive entries into curated case studies. */
export function buildProjects(entries: DriveEntry[]): Project[] {
  const clean = entries.filter((entry) => !NOISE.test(entry.name));

  const buckets = new Map<string, { rule: Rule | null; key: string; entries: DriveEntry[] }>();

  for (const entry of clean) {
    const rule = RULES.find((candidate) => candidate.test.test(entry.name)) ?? null;
    const key = rule ? rule.slug : groupKey(entry.name);
    const bucket = buckets.get(key) ?? { rule, key, entries: [] };
    bucket.entries.push(entry);
    buckets.set(key, bucket);
  }

  const projects: Project[] = [];

  for (const bucket of buckets.values()) {
    const rule = bucket.rule;
    const title = rule?.title ?? titleCase(bucket.key);
    const slug = rule?.slug ?? slugify(bucket.key);
    const meta = rule ?? { ...FALLBACK, slug, title };

    const assets = bucket.entries.map(toAsset);
    const images = assets.filter((asset) => asset.isImage);
    const files = assets.filter((asset) => !asset.isImage);
    const cover =
      images.slice().sort((a, b) => a.name.localeCompare(b.name))[0] ?? assets[0] ?? null;
    const story = narrative(meta);

    projects.push({
      slug,
      title,
      client: meta.client,
      industry: meta.industry,
      year: rule?.year ?? yearFrom(bucket.entries),
      category: meta.category,
      discipline: meta.discipline,
      summary: meta.summary,
      services: meta.services,
      deliverables: Array.from(
        new Set(assets.map((asset) => asset.software ?? asset.ext.toUpperCase()).filter(Boolean)),
      ),
      keywords: Array.from(
        new Set([
          ...(rule?.keywords ?? []),
          ...bucket.entries.flatMap((entry) =>
            baseNameOf(entry.name)
              .toLowerCase()
              .split(/[^a-z0-9]+/)
              .filter((word) => word.length > 2),
          ),
        ]),
      ).slice(0, 24),
      cover,
      images,
      files,
      assetCount: assets.length,
      ...story,
    });
  }

  const curated = projects.filter((project) => project.assetCount > 0);
  return [...CURATED_PROJECTS, ...curated].sort(
    (a, b) => b.assetCount - a.assetCount || a.title.localeCompare(b.title),
  );
}

export function categoriesOf(projects: Project[]): string[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort();
}

export function matchesQuery(project: Project, query: string): boolean {
  const haystack = [
    project.title,
    project.client,
    project.industry,
    project.category,
    project.discipline,
    project.year,
    project.summary,
    ...project.services,
    ...project.deliverables,
    ...project.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}
