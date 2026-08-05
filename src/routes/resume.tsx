import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { certifications, education, profile, services, skills, timeline } from "@/lib/site";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Collins Murakayo" },
      {
        name: "description",
        content:
          "Experience, skills, education and certifications for Collins Murakayo — multidisciplinary designer, creative strategist and data analyst.",
      },
      { property: "og:title", content: "Resume — Collins Murakayo" },
      {
        property: "og:description",
        content: "Career timeline across brand design, marketing production and business intelligence.",
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <section className="shell pt-16 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Resume</p>
          <h1 className="display-xl mt-6">{profile.name}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{profile.roles.join(" · ")}</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center rounded-full border border-hairline px-6 text-sm font-medium text-foreground hover:bg-secondary"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="rule-top mt-16 pt-16">
        <h2 className="display-lg">Experience</h2>
        <div className="mt-12 space-y-px overflow-hidden border border-hairline bg-hairline">
          {timeline.map((item, index) => (
            <Reveal key={item.period} delay={index * 0.05} className="bg-background p-8">
              <div className="grid gap-4 md:grid-cols-12">
                <p className="font-mono text-xs text-accent md:col-span-3">{item.period}</p>
                <div className="md:col-span-9">
                  <h3 className="font-display text-xl tracking-tight">{item.role}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.org}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="rule-top mt-24 grid gap-16 pt-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="display-lg">Skills</h2>
          <div className="mt-10 space-y-10">
            {skills.map((group) => (
              <div key={group.group}>
                <h3 className="eyebrow">{group.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-hairline px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12 lg:col-span-5">
          <div>
            <h2 className="font-display text-2xl tracking-tight">Education</h2>
            <ul className="mt-6 space-y-5">
              {education.map((item) => (
                <li key={item.title} className="border-t border-hairline pt-4">
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.org}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl tracking-tight">Certifications</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {certifications.map((item) => (
                <li key={item} className="border-t border-hairline pt-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rule-top mt-24 pt-16">
        <h2 className="display-lg">Service areas</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((group) => (
            <div key={group.group}>
              <h3 className="eyebrow">{group.group}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {group.items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
