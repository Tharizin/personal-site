import type { Metadata } from "next";
import { ContentGrid } from "@/components/ContentGrid";
import { getReadingRecs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reading",
};

export default function ReadingPage() {
  // Read at build time from content/reading-recs, which Decap CMS commits to.
  const items = getReadingRecs();

  return (
    <ContentGrid
      title="Reading"
      description="Books, essays, and articles worth remembering."
      items={items}
      emptyMessage="No reading recommendations yet. Add one in the content manager at /admin."
    />
  );
}
