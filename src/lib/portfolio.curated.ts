/**
 * Curated projects that don't come from the Google Drive CMS — e.g. recent work
 * delivered directly by the client. Merged ahead of the Drive-generated list.
 */
import type { Asset, Project } from "./portfolio";

import coverSpread from "@/assets/mucapa-brochure-cover-spread.asset.json";
import coverFront from "@/assets/mucapa-brochure-cover-top.asset.json";
import coverBack from "@/assets/mucapa-brochure-cover-bottom.asset.json";
import insideSpread from "@/assets/mucapa-brochure-inside-spread.asset.json";
import insideLeft from "@/assets/mucapa-brochure-inside-left.asset.json";
import insideRight from "@/assets/mucapa-brochure-inside-right.asset.json";
import cardFront from "@/assets/mucapa-business-card-front.asset.json";
import cardBack from "@/assets/mucapa-business-card-back.asset.json";
import logo from "@/assets/mucapa-logo.asset.json";

function localAsset(name: string, pointer: { url: string }, ext: string): Asset {
  return {
    id: `mucapa-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    ext,
    kind: "image",
    software: null,
    previewUrl: pointer.url,
    fullUrl: pointer.url,
    downloadUrl: pointer.url,
    viewUrl: pointer.url,
    isImage: true,
  };
}

const assets: Asset[] = [
  localAsset("Pitch brochure — cover spread", coverSpread, "jpg"),
  localAsset("Front cover — Onions, delivered by the tonne", coverFront, "jpg"),
  localAsset("Back cover — Let's plan your first shipment", coverBack, "jpg"),
  localAsset("Inside spread mockup", insideSpread, "jpg"),
  localAsset("Inside — Why MUCAPA", insideLeft, "jpg"),
  localAsset("Inside — What we offer", insideRight, "jpg"),
  localAsset("Business card — front", cardFront, "jpg"),
  localAsset("Business card — back", cardBack, "jpg"),
  localAsset("Mucapa Company Limited — logo", logo, "png"),
];

export const CURATED_PROJECTS: Project[] = [
  {
    slug: "mucapa-onion-supply-pitch",
    title: "Mucapa Company Limited — Onion Supply Pitch Kit",
    client: "Mucapa Company Limited",
    industry: "Agriculture & Food Distribution",
    year: "2026",
    category: "Brand Identity",
    discipline: "Brand Identity & Pitch Collateral",
    summary:
      "A client-facing pitch kit for an onion distribution business — logo, business cards and a bi-fold brochure that sells dependable tonnage, not decoration.",
    objectives: [
      "Give Mucapa a pitch kit that makes a first impression before anyone meets.",
      "Lead with the commercial promise — consistent quality, delivered by the tonne.",
      "Keep the identity, cards and brochure reading as one coherent system.",
      "Make every touchpoint carry a clear next step: plan your first shipment.",
    ],
    challenge:
      "Mucapa is a young distribution business pitching procurement managers who buy on reliability, not charm. The materials had to translate a supply promise — graded onions, scheduled deliveries, volumes that scale — into a clean, confident print system that survives a boardroom table and a WhatsApp forward alike.",
    research:
      "Looked at how the target buyers actually evaluate suppliers — quality consistency, delivery reliability and flexible volumes — and audited the pitch materials the sector normally sends. That pointed to a brochure structured around an offer table and a four-step 'how it works', rather than mood imagery alone.",
    process: [
      "Defined the commercial message: tonnage, grading and dependable delivery first",
      "Built the identity around the onion mark — purple bulb, green leaves, deep green canvas",
      "Structured the bi-fold: front cover promise, why-Mucapa proof, offer table, contact panel",
      "Designed business cards with scannable contact details for the operations lead",
      "Prepared print-ready artwork and validated it in realistic mockups",
    ],
    solution:
      "A restrained green-and-purple identity system: the onion mark anchors everything, the brochure leads with 'Onions, delivered by the tonne', then proves it — consistent quality, reliable delivery, flexible volumes from 2 tonnes per shipment — before closing on a direct call to action. The business card carries the same hierarchy, so the kit works as one continuous pitch.",
    services: ["Brand Identity", "Business Card Design", "Brochure Design", "Print Production"],
    deliverables: ["Logo artwork", "Business cards (front & back)", "Bi-fold brochure (4 panels)"],
    keywords: [
      "mucapa",
      "onion",
      "distribution",
      "supply",
      "agriculture",
      "brochure",
      "business card",
      "pitch",
      "brand identity",
      "print",
    ],
    cover: assets[0]!,
    images: assets,
    files: [],
    assetCount: assets.length,
  },
];
