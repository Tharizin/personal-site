import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";
import { HeroMist } from "@/components/HeroMist";
import { heroCornerInset } from "@/lib/layout";
import { siteConfig } from "@/lib/site";

const contactLinks = [
  {
    label: "Email",
    href: "mailto:echamb@stanford.edu",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/tharizin",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/edith-chamberlain",
    icon: Linkedin,
  },
] as const;

/** Intrinsic size of public/hero.webp. */
const HERO_WIDTH = 1708;
const HERO_HEIGHT = 960;

export function Hero() {
  return (
    <section className="relative w-full">
      {/*
        The hero art already contains the "EDITH CHAMBERLAIN" lettering, and
        that lettering runs nearly edge to edge (roughly 4% to 97% of the
        image width). Cropping horizontally would clip the first and last
        letters, so the image is laid out full-bleed at its natural aspect
        ratio rather than with `bg-cover`. On a typical desktop window the
        lettering lands around 30-45% of the way down, comfortably above the
        fold, and the foreground meadow runs past it to invite scrolling.
      */}
      <Image
        src="/hero.webp"
        alt={`${siteConfig.firstName} ${siteConfig.lastName}`}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        sizes="100vw"
        priority
        className="block h-auto w-full select-none"
      />

      <HeroMist />

      {/*
        The name is set in the artwork, so it is exposed to screen readers and
        search engines as a visually hidden heading instead of rendered twice.
      */}
      <h1 className="sr-only">
        {siteConfig.firstName} {siteConfig.lastName}
      </h1>

      {/*
        Dark icons: this image opens on a pale sky, so the previous white
        treatment washed out. The soft white glow keeps them readable wherever
        the sky brightens.
      */}
      <div
        className={`absolute z-10 flex items-center gap-4 sm:gap-5 ${heroCornerInset}`}
      >
        {contactLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="text-neutral-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] transition-colors hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </a>
        ))}
      </div>
    </section>
  );
}
