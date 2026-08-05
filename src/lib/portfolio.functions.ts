import { createServerFn } from "@tanstack/react-start";

import { buildProjects, type Project } from "./portfolio";

export const getProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => {
    const { fetchDriveEntries } = await import("./drive.server");
    return buildProjects(await fetchDriveEntries());
  },
);
