import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";

import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { getProjects } from "@/lib/portfolio.functions";

const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "process", label: "Creative process" },
  { id: "solution", label: "Final solution" },
  { id: "gallery", label: "Gallery" },
  { id: "deliverables", label: "Deliverables" },
  { id: "related", label: "Related" },
] as const;

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const projects = await context.queryClient.ensureQueryData(projectsQuery);
    const project = projects.find((item) => item.slug === params.slug);
    if (!project) throw notFound();
    return { title: project.title, summary: project.summary, cover: project.cover?.fullUrl ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project unavailable — Collins Murakayo" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Collins Murakayo` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: `${loaderData.title} — Collins Murakayo` },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: CaseStudy,
});

function CaseStudy() {
  const { slug } = Route.useParams();
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <section className="shell py-32">
        <h1 className="display-lg">Project not found</h1>
        <Link to="/projects" className="link-underline mt-6 inline-block text-sm text-accent">
          Back to projects
        </Link>
      </section>
    );
  }

  const related = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 2);
  const fallbackRelated = projects.filter((item) => item.slug !== project.slug).slice(0, 2);
  const relatedProjects = related.length > 0 ? related : fallbackRelated;

  return (
    <article>
      <header className="shell pt-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Projects
        </Link>
        <p className="eyebrow mt-10">
          {project.category} · {project.year}
        </p>
        <h1 className="display-xl mt-6 max-w-5xl">{project.title}</h1>
        <p className="lede mt-8">{project.summary}</p>
      </header>

      {project.cover ? (
        <Reveal className="shell mt-14">
          <div className="relative aspect-[16/9] overflow-hidden bg-surface">
            <img
              src={project.cover.fullUrl}
              alt={`${project.title} hero image`}
              className="size-full object-cover"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-hairline" />
          </div>
        </Reveal>
      ) : null}

      <div className="shell mt-20 grid gap-16 lg:grid-cols-12">
        {/* Sticky table of contents */}
        <nav aria-label="Case study sections" className="lg:col-span-3">
          <div className="sticky top-28">
            <p className="eyebrow">Contents</p>
            <ul className="mt-4 space-y-2 text-sm">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="link-underline text-muted-foreground hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-9">
          {/* Overview */}
          <section id="overview" className="scroll-mt-28">
            <h2 className="display-lg">Overview</h2>
            <dl className="mt-10 grid gap-8 border-y border-hairline py-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Client", value: project.client },
                { label: "Industry", value: project.industry },
                { label: "Year", value: project.year },
                { label: "Discipline", value: project.discipline },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-2 text-sm text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">Services</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow">Objectives</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {project.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Challenge & research */}
          <section id="challenge" className="mt-24 scroll-mt-28">
            <h2 className="display-lg">Challenge</h2>
            <p className="lede mt-6">{project.challenge}</p>
            <h3 className="mt-12 font-display text-xl tracking-tight">Research</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {project.research}
            </p>
          </section>

          {/* Process */}
          <section id="process" className="mt-24 scroll-mt-28">
            <h2 className="display-lg">Creative process</h2>
            <ol className="mt-10 divide-y divide-hairline border-y border-hairline">
              {project.process.map((step, index) => (
                <li key={step} className="flex gap-6 py-5">
                  <span className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Solution */}
          <section id="solution" className="mt-24 scroll-mt-28">
            <h2 className="display-lg">Final solution</h2>
            <p className="lede mt-6">{project.solution}</p>
          </section>
        </div>
      </div>

      {/* Gallery */}
      <section id="gallery" className="shell mt-28 scroll-mt-28">
        <h2 className="display-lg">Gallery</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {project.images.map((asset, index) => (
            <Reveal
              key={asset.id}
              delay={Math.min(index, 4) * 0.05}
              className={index % 5 === 0 ? "md:col-span-2" : undefined}
            >
              <figure>
                <div className="relative overflow-hidden bg-surface">
                  <img
                    src={asset.previewUrl}
                    alt={`${project.title} — ${asset.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-hairline" />
                </div>
                <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
                  {asset.name}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section id="deliverables" className="shell mt-28 scroll-mt-28">
        <h2 className="display-lg">Deliverables</h2>
        <p className="lede mt-6">
          Source and production files, presented openly. {project.deliverables.join(" · ")}
        </p>

        {project.files.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            This case study ships as image deliverables only.
          </p>
        ) : (
          <ul className="mt-10 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {project.files.map((asset) => (
              <li key={asset.id} className="flex flex-col justify-between gap-6 bg-background p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <FileText aria-hidden="true" className="size-5 text-accent" />
                    <span className="font-mono text-xs uppercase text-muted-foreground">
                      {asset.ext}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-snug break-words text-foreground">
                    {asset.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {asset.software ?? "Source file"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={asset.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-4 text-xs text-foreground hover:bg-secondary"
                  >
                    Preview <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href={asset.downloadUrl}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-xs text-primary-foreground"
                  >
                    Download <Download className="size-3.5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related */}
      <section id="related" className="shell mt-28 scroll-mt-28">
        <h2 className="display-lg">Related projects</h2>
        <div className="mt-10 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {relatedProjects.map((item, index) => (
            <ProjectCard key={item.slug} project={item} index={index} />
          ))}
        </div>
      </section>
    </article>
  );
}
