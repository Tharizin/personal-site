import type { Metadata } from "next";
import { ContentGrid } from "@/components/ContentGrid";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Art",
};

export default function ArtPage() {
  // Read at build time from content/gallery, which Decap CMS commits to.
  const items = getGallery();

  return (
    <ContentGrid
      title="Art"
      description="A collection of artwork, sketches, and creative experiments."
      items={items}
      emptyMessage="No gallery entries yet. Add one in the content manager at /admin."
    />
  );
}
