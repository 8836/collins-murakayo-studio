import { Link, createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { beyondDesign, services } from "@/lib/site";

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
    title: "Reporting & dashboards",
    scope: "2 — 6 weeks",
    body: "Data model, chart grammar and a Power BI or Excel reporting pack designed for decisions, not decoration.",
  },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Collins Murakayo" },
      {
        name: "description",
        content:
          "Brand identity, marketing and presentation design, print and packaging production, plus data visualization, dashboards and business reporting.",
      },
      { property: "og:title", content: "Services — Collins Murakayo" },
      {
        property: "og:description",
        content: "Design and analytics engagements for brands that need clarity and evidence.",
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
        Four capabilities, one standard of precision.
      </h1>
      <p className="lede mt-8">
        Engagements run end to end: strategy, design, production artwork and the reporting that
        tells you whether it worked.
      </p>

      <div className="mt-16 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2">
        {services.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.05} className="bg-background p-8 md:p-10">
            <p className="font-mono text-xs text-accent">0{index + 1}</p>
            <h2 className="mt-4 font-display text-2xl tracking-tight">{group.group}</h2>
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
        <h2 className="display-lg">Beyond design</h2>
        <p className="lede mt-6">
          The analytical half of the practice — the work that keeps the creative half honest.
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
