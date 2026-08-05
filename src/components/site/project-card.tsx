import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import type { Project } from "@/lib/portfolio";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: Math.min(index, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {project.cover ? (
            <img
              src={project.cover.previewUrl}
              alt={`${project.title} — ${project.category} work by Collins Murakayo`}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <span className="eyebrow">{project.category}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-hairline" />
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{project.category}</p>
            <h3 className="mt-2 font-display text-xl leading-snug tracking-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          </div>
          <span className="mt-1 shrink-0 font-mono text-xs text-muted-foreground">
            {project.year}
          </span>
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 border-t border-hairline pt-3 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <dt className="sr-only">Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Industry</dt>
            <dd>{project.industry}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Assets</dt>
            <dd>{project.assetCount} assets</dd>
          </div>
        </dl>
      </Link>
    </motion.article>
  );
}
