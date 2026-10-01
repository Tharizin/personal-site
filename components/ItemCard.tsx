import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { formatDate, type CardItem } from "@/lib/content";

/**
 * One entry in a tab.
 *
 * Images come from `public/images/uploads`, which is where Decap's
 * `media_folder` puts them, so they are ordinary local files and next/image
 * optimises them at build time.
 */
export function ItemCard({ item }: { item: CardItem }) {
  const date = formatDate(item.date);

  return (
    <article className="relative overflow-hidden rounded-lg border border-slate-400/30 bg-white shadow-sm">
      {item.image && (
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-base font-medium text-neutral-900">
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 hover:text-coral"
            >
              {item.title}
              <ArrowUpRight
                className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-coral"
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          ) : (
            item.title
          )}
        </h2>

        {item.subtitle && (
          <p className="mt-0.5 text-sm text-neutral-700">{item.subtitle}</p>
        )}

        {date && (
          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
            {date}
          </p>
        )}

        {item.body && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {item.body}
          </p>
        )}
      </div>
    </article>
  );
}
