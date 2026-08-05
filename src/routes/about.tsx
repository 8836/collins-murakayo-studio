import { Link, createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { philosophy, profile, skills, values } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Collins Murakayo" },
      {
        name: "description",
        content:
          "Collins Murakayo is a multidisciplinary designer and data analyst based in Nairobi, working across brand identity, marketing design and business intelligence.",
      },
      { property: "og:title", content: "About — Collins Murakayo" },
      {
        property: "og:description",
        content:
          "A practice built on systems thinking: brand identity, communication design and analytics under one discipline.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="shell pt-16 pb-28">
      <p className="eyebrow">About</p>
      <h1 className="display-xl mt-6 max-w-4xl">
        A designer who reads the numbers, and an analyst who cares how it looks.
      </h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <p className="lede">{profile.intro}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            My work sits between two disciplines that rarely share a room. On one side: brand
            identity, packaging, editorial and campaign design — the craft of making an
            organisation legible. On the other: dashboards, reporting and process work — the
            discipline of proving whether any of it moved the business.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Holding both means I design with constraints already understood: production budgets,
            print tolerances, reporting cycles, the operational reality behind the brief. Clients
            get fewer surprises and work that survives contact with the real world.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Based in {profile.location}. Currently taking on brand systems, campaign programmes and
            reporting engagements.
          </p>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-hairline p-8">
            <h2 className="eyebrow">Principles</h2>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {values.map((value) => (
                <li key={value} className="border-b border-hairline pb-3 last:border-0 last:pb-0">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">How I work</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {philosophy.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <p className="font-mono text-xs text-accent">0{index + 1}</p>
              <h3 className="mt-4 font-display text-xl tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">Toolkit</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {skills.map((group) => (
            <div key={group.group}>
              <h3 className="border-b border-hairline pb-3 font-display text-lg tracking-tight">
                {group.group}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rule-top mt-24 flex flex-wrap items-center justify-between gap-6 pt-16">
        <p className="display-lg max-w-xl">Let's build something durable.</p>
        <Link
          to="/contact"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
