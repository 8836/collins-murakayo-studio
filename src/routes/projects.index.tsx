import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/site/project-card";
import { getProjects } from "@/lib/portfolio.functions";
import { categoriesOf, matchesQuery } from "@/lib/portfolio";

const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});

export const Route = createFileRoute("/projects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  head: () => ({
    meta: [
      { title: "Projects — Collins Murakayo" },
      {
        name: "description",
        content:
          "Case studies across brand identity, corporate identity, packaging, print, large format, album artwork, photography and data visualization.",
      },
      { property: "og:title", content: "Projects — Collins Murakayo" },
      {
        property: "og:description",
        content: "A curated archive of brand, campaign, production and data work.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...categoriesOf(projects)], [projects]);
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === "All" || project.category === category) &&
          (query.trim() === "" || matchesQuery(project, query)),
      ),
    [projects, category, query],
  );

  return (
    <section className="shell pt-16 pb-24">
      <p className="eyebrow">Archive</p>
      <h1 className="display-xl mt-6 max-w-4xl">Projects</h1>
      <p className="lede mt-8">
        Every case study here is generated from a live archive, then organised by discipline,
        client and year. Search by client, industry, software or keyword.
      </p>

      <div className="mt-14 flex flex-col gap-6 border-y border-hairline py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, client, industry, software…"
            className="min-h-11 w-full border-0 bg-transparent pl-7 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-hairline text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">
          Nothing matches that search yet. Try a broader term.
        </p>
      ) : (
        <div className="mt-10 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {filtered.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
