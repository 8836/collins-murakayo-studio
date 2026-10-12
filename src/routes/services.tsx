import { Link, createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { beyondDesign, recentExperience, services, supportCaseStudy } from "@/lib/site";

const engagements = [
  {
    title: "Brand system",
    scope: "4 — 8 weeks",
    body: "Discovery, positioning, identity design, guidelines and a rollout kit your team can actually operate without me.",
  },
  {
    title: "Campaign programme",
    scope: "2 — 4 weeks",
    body: "A full marketing set: social, print, large format and presentation assets built from one grid and one type scale.",
  },
  {
    title: "Video & production",
    scope: "1 — 4 weeks",
    body: "Storyboard, shoot, edit and colour for promotional or music video — or production-ready artwork for print, CNC and large-format output.",
  },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Collins Murakayo" },
      {
        name: "description",
        content:
          "Virtual assistance, content management, content production, graphic design, digital marketing and email marketing support.",
      },
      { property: "og:title", content: "Services — Collins Murakayo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Design, production and video engagements for brands that need clarity and craft.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <section className="shell pt-16 pb-28">
      <p className="eyebrow">Services</p>
      <h1 className="display-xl mt-6 max-w-4xl">
        How I Can Help.
      </h1>
      <p className="lede mt-8">
        Six ways I support businesses — from organized day-to-day assistance to polished content
        and design.
      </p>

      <div className="mt-16 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {services.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.05} className="bg-background p-8 md:p-10">
            <p className="font-mono text-xs text-accent">0{index + 1}</p>
            <h2 className="mt-4 font-display text-2xl tracking-tight">{group.group}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{group.body}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {group.items.map((item) => (
                <li key={item} className="border-b border-hairline pb-3 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">Recent experience</h2>
        <p className="lede mt-6">{recentExperience.period} of experience across each of these areas.</p>
        <ul className="mt-10 flex flex-wrap gap-2">
          {recentExperience.areas.map((area) => (
            <li key={area} className="rounded-full border border-hairline px-4 py-2 text-xs text-muted-foreground">
              {area} <span className="ml-2 font-mono text-accent">{recentExperience.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rule-top mt-24 pt-16">
        <p className="eyebrow">{supportCaseStudy.category}</p>
        <h2 className="display-lg mt-4">{supportCaseStudy.title}</h2>
        <p className="lede mt-6">{supportCaseStudy.description}</p>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <h3 className="eyebrow">My contribution</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {supportCaseStudy.contribution.map((item) => (
                <li key={item} className="border-t border-hairline pt-3">{item}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="eyebrow">Tools</h3>
            <p className="mt-4 text-sm text-muted-foreground">{supportCaseStudy.tools.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">How engagements are shaped</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {engagements.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl tracking-tight">{item.title}</h3>
              <p className="mt-2 font-mono text-xs text-accent">{item.scope}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">Beyond graphic design</h2>
        <p className="lede mt-6">
          The production and motion half of the practice — where the work leaves the screen.
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {beyondDesign.map((item) => (
            <div key={item.title} className="border-t border-hairline pt-6">
              <h3 className="font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rule-top mt-24 flex flex-wrap items-center justify-between gap-6 pt-16">
        <p className="display-lg max-w-xl">Tell me what needs to change.</p>
        <Link
          to="/contact"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground"
        >
          Start a project
        </Link>
      </div>
    </section>
  );
}
