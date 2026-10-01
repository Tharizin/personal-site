import type { Metadata } from "next";
import { ContentGrid } from "@/components/ContentGrid";
import { fromPlaceholders } from "@/lib/content";
import { projectItems } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
};

/*
  Also outside the CMS config. These two entries are real, so they stay in
  lib/site.ts rather than reverting to placeholders.
*/
export default function ProjectsPage() {
  return (
    <ContentGrid
      title="Projects & Websites"
      description="Side projects, experiments, and sites I've built."
      items={fromPlaceholders(projectItems)}
    />
  );
}
