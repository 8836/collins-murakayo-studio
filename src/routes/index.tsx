import { Link, createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { getProjects } from "@/lib/portfolio.functions";
import { beyondDesign, philosophy, profile, services } from "@/lib/site";

const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  head: () => ({
    meta: [
      { title: "Collins Murakayo — Virtual Assistant, Content Manager & Designer" },
      {
        name: "description",
        content:
          "Virtual assistance, content management, content production, graphic design and digital marketing support from Nairobi-based Collins Murakayo Mulechi.",
      },
      { property: "og:title", content: "Collins Murakayo — Virtual Assistant, Content Manager & Designer" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "A design and video practice spanning identity systems, large-format production and promotional film.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const reduced = useReducedMotion();
  const featured = projects.slice(0, 6);

  return (
    <>
      {/* Hero -------------------------------------------------------------- */}
      <section className="shell relative pt-16 pb-24 md:pt-28 md:pb-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="eyebrow"
        >
          {profile.location}
        </motion.p>

        <h1 className="display-xl mt-8 max-w-5xl">
          {profile.headline.split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: "0.6em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1 + index * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-medium tracking-wide text-muted-foreground md:text-lg"
        >
          {profile.heroRoles.map((role, i) => (
            <span key={role} className="flex items-center gap-4">
              {i > 0 && <span className="size-1 rounded-full bg-primary" aria-hidden />}
              <span className="text-foreground/90">{role}</span>
            </span>
          ))}
        </motion.p>

        <Reveal delay={0.55} className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="lede md:col-span-7">{profile.homeIntro}</p>
          <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end">
            <Link
              to="/projects"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              View My Work <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/resume"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Download Resume
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-accent link-underline"
            >
              Contact Me <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <motion.div
          aria-hidden="true"
          className="mt-24 flex items-center gap-3 text-muted-foreground"
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
          <span className="eyebrow">Scroll</span>
        </motion.div>
      </section>

      {/* Stats ------------------------------------------------------------- */}
      <section className="shell rule-top py-12" aria-label="Practice at a glance">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { label: "Case studies", value: String(projects.length) },
            {
              label: "Assets curated",
              value: String(projects.reduce((total, project) => total + project.assetCount, 0)),
            },
            { label: "Disciplines", value: "12+" },
            { label: "Based in", value: "Nairobi" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="eyebrow">{stat.label}</dt>
              <dd className="mt-2 font-display text-3xl tracking-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Selected work ----------------------------------------------------- */}
      <section className="shell py-24" aria-labelledby="work-heading">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-heading" className="display-lg mt-4 max-w-2xl">
              Case studies built from the archive.
            </h2>
          </div>
          <Link to="/projects" className="link-underline text-sm text-accent">
            All projects
          </Link>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {featured.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* Services --------------------------------------------------------- */}
      <section className="shell rule-top py-24" aria-labelledby="services-heading">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Capabilities</p>
            <h2 id="services-heading" className="display-lg mt-4">
              How I Can Help.
            </h2>
            <Link to="/services" className="link-underline mt-6 inline-block text-sm text-accent">
              Full service list
            </Link>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:col-span-8">
            {services.map((group, index) => (
              <Reveal key={group.group} delay={index * 0.05}>
                <h3 className="border-b border-hairline pb-3 font-display text-lg tracking-tight">
                  {group.group}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{group.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy -------------------------------------------------------- */}
      <section className="shell rule-top py-24" aria-labelledby="philosophy-heading">
        <h2 id="philosophy-heading" className="display-lg max-w-3xl">
          Design is an operating system, not a decoration.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {philosophy.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <p className="font-mono text-xs text-accent">0{index + 1}</p>
              <h3 className="mt-4 font-display text-xl tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Beyond design ----------------------------------------------------- */}
      <section className="bg-surface py-24" aria-labelledby="beyond-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Beyond design</p>
              <h2 id="beyond-heading" className="display-lg mt-4 max-w-2xl">
                Video and production, held to the same standard.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Promotional film, motion and machine-side production carried with the same rigour as
              the design work — because clients buy finished, installed outcomes.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {beyondDesign.map((item) => (
              <div key={item.title} className="bg-background p-8">
                <h3 className="font-display text-lg tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA --------------------------------------------------------------- */}
      <section className="shell py-28 text-center">
        <h2 className="display-lg mx-auto max-w-3xl">
          Available for brand, campaign and video work.
        </h2>
        <Link
          to="/contact"
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
        >
          Start a conversation <ArrowRight className="size-4" />
        </Link>
      </section>
    </>
  );
}
