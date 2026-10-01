export const siteConfig = {
  firstName: "EDITH",
  lastName: "CHAMBERLAIN",
  name: "EDITH CHAMBERLAIN",
  description:
    "Senior at Stanford interested in wildlife, botany, and scientific illustration.",
  bio:
    "I am a senior at Stanford University interested in wildlife, botany, and " +
    "scientific illustration. I also dabble in vibe coding, as is almost " +
    "required in Silicon Valley. Below are two of my projects.",
  cta: {
    label: "View projects",
    href: "/projects",
  },
};

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Art", href: "/art" },
  { label: "Reading", href: "/reading" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Projects", href: "/projects" },
];

export type PlaceholderItem = {
  id: string;
  title: string;
  description: string;
  /** External or internal URL. When set, the card and buttons link to it. */
  href?: string;
};

export const artItems: PlaceholderItem[] = [
  {
    id: "art-1",
    title: "Placeholder artwork",
    description: "A brief description of this piece or series.",
  },
  {
    id: "art-2",
    title: "Placeholder artwork",
    description: "A brief description of this piece or series.",
  },
  {
    id: "art-3",
    title: "Placeholder artwork",
    description: "A brief description of this piece or series.",
  },
];

export const readingItems: PlaceholderItem[] = [
  {
    id: "reading-1",
    title: "Placeholder book",
    description: "Author name and a short note about why you enjoyed it.",
  },
  {
    id: "reading-2",
    title: "Placeholder book",
    description: "Author name and a short note about why you enjoyed it.",
  },
  {
    id: "reading-3",
    title: "Placeholder book",
    description: "Author name and a short note about why you enjoyed it.",
  },
];

export const recommendationItems: PlaceholderItem[] = [
  {
    id: "rec-1",
    title: "Placeholder recommendation",
    description: "A film, album, tool, or place worth sharing.",
  },
  {
    id: "rec-2",
    title: "Placeholder recommendation",
    description: "A film, album, tool, or place worth sharing.",
  },
  {
    id: "rec-3",
    title: "Placeholder recommendation",
    description: "A film, album, tool, or place worth sharing.",
  },
];

export const projectItems: PlaceholderItem[] = [
  {
    id: "stanford-fruit-map",
    title: "Stanford Fruit Map",
    description:
      "An interactive guide to every fruit tree on Stanford's campus, with ripening windows, uses, and a gallery of other edible plants.",
    href: "https://stanford-fruit-map.vercel.app/index.html",
  },
  {
    id: "phylo",
    title: "Phylo",
    description:
      "A tool for logging the food you eat at the species level, so you can track how much plant, animal, and fungal diversity is actually on your plate.",
    href: "https://phylo-gamma.vercel.app",
  },
];
