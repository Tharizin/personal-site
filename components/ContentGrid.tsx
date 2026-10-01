import { ItemCard } from "@/components/ItemCard";
import type { CardItem } from "@/lib/content";

type ContentGridProps = {
  title: string;
  description: string;
  items: CardItem[];
  /** Shown when the collection is empty, in place of the default. */
  emptyMessage?: string;
};

export function ContentGrid({
  title,
  description,
  items,
  emptyMessage,
}: ContentGridProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="text-neutral-700">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-400/50 p-8 text-center text-sm text-neutral-600">
          {emptyMessage ?? "Nothing here yet."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
