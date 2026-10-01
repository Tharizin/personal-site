import type { Metadata } from "next";
import { ContentGrid } from "@/components/ContentGrid";
import { fromPlaceholders } from "@/lib/content";
import { recommendationItems } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recommendations",
};

/*
  No CMS collection covers this tab yet -- config.yml defines only Gallery and
  Reading Recs -- so it renders the hand-written entries in lib/site.ts. Adding
  a third collection would make it editable the same way as the other two.
*/
export default function RecommendationsPage() {
  return (
    <ContentGrid
      title="Recommendations"
      description="Things I like and think you might too."
      items={fromPlaceholders(recommendationItems)}
    />
  );
}
