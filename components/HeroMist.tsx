"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Pale slate mist that rises over the hero as the page scrolls, so the bottom
 * of the photograph dissolves into the About panel instead of ending on a
 * hard horizontal edge.
 *
 * Two stacked layers, both driven by CSS custom properties that this component
 * rewrites from a passive scroll listener:
 *
 *   --mist-p    0 -> 1    climbs the bottom-anchored gradient up the image.
 *   --mist-veil 0 -> 0.9  fades in a flat wash over the last stretch of the
 *                         travel, so the photo is fully melded by the time the
 *                         About panel takes over the viewport.
 *
 * Both properties have a resting value set in the markup below, which means the
 * seam is already gone on first paint — before hydration, and permanently if
 * JavaScript never runs.
 */
export function HeroMist() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const section = node?.parentElement;
    if (!node || !section) return;

    // A wash that tracks the scrollbar can be unpleasant for anyone sensitive
    // to motion, so leave the resting gradient in place for them. The seam is
    // hidden either way; only the movement is dropped.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const { top, height } = section.getBoundingClientRect();
      // Reach full strength slightly before the hero finishes scrolling past,
      // so the handoff to the panel is already complete when it arrives.
      const travel = Math.max(1, height * 0.7);
      const progress = Math.min(1, Math.max(0, -top / travel));
      const veil = Math.min(1, Math.max(0, (progress - 0.45) / 0.45));
      node.style.setProperty("--mist-p", progress.toFixed(4));
      node.style.setProperty("--mist-veil", (veil * 0.9).toFixed(4));
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into one write per painted frame.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // -bottom-px overlaps the panel by a pixel, so subpixel rounding can
      // never leave a hairline of bare photo at the join.
      className="pointer-events-none absolute inset-x-0 top-0 -bottom-px"
      style={{ "--mist-p": "0", "--mist-veil": "0" } as CSSProperties}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top,
            rgb(var(--mist-rgb)) 0%,
            rgb(var(--mist-rgb)) calc(1% + var(--mist-p) * 59%),
            rgb(var(--mist-rgb) / 0.8) calc(5% + var(--mist-p) * 75%),
            rgb(var(--mist-rgb) / 0.35) calc(13% + var(--mist-p) * 79%),
            rgb(var(--mist-rgb) / 0) calc(24% + var(--mist-p) * 82%))`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgb(var(--mist-rgb))",
          opacity: "var(--mist-veil)",
        }}
      />
    </div>
  );
}
