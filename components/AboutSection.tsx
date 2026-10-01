import { ArrowUpRight } from "lucide-react";
import { projectItems, siteConfig } from "@/lib/site";

export function AboutSection() {
  return (
    /*
      Two things are going on with the vertical rhythm here.

      `-mt-[10vh]` pulls the panel up into the bottom of the hero. That region
      is solid mist by the time you reach it, so the overlap costs nothing
      visually and reclaims dead space -- only this section's top padding lands
      in it, never the text.

      `min-h-[80vh]` makes the document tall enough to scroll the hero fully
      out of the way. Without it the page was barely taller than the viewport,
      so even at maximum scroll the hero still occupied the top half and the
      text was stranded near the bottom of the screen.
    */
    <section
      id="about"
      className="relative -mt-[10vh] min-h-[80vh] px-4 pb-24 pt-[14vh] sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            About Me
          </h2>
          <p className="text-base leading-relaxed text-neutral-700">
            {siteConfig.bio}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {projectItems.map((project) => (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-3 rounded-lg bg-coral px-5 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral sm:justify-center"
              >
                {project.title}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
