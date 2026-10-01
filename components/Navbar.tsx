"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { heroCornerInsetRight, navInsetPadding } from "@/lib/layout";
import { navItems } from "@/lib/site";

function NavLink({
  href,
  label,
  overHero,
}: {
  href: string;
  label: string;
  overHero: boolean;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        overHero
          ? isActive
            ? "font-medium text-neutral-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
            : "text-neutral-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] hover:text-coral"
          : isActive
            ? "font-medium text-neutral-900"
            : "text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === "/";

  if (overHero) {
    return (
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <nav
          className={`pointer-events-auto absolute hidden items-center gap-6 ${heroCornerInsetRight} md:flex`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              overHero={overHero}
            />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`pointer-events-auto absolute text-sm text-neutral-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] hover:text-coral md:hidden ${heroCornerInsetRight}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        {menuOpen && (
          <div
            id="mobile-nav"
            className={`pointer-events-auto absolute mt-8 bg-black/40 px-4 py-4 backdrop-blur-sm md:hidden ${heroCornerInsetRight}`}
          >
            <div className="flex flex-col items-end gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-400/25 bg-mist/85 backdrop-blur">
      <nav className={`flex items-center justify-end ${navInsetPadding}`}>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              overHero={overHero}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md border border-slate-400/40 px-3 py-1.5 text-sm text-neutral-800 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-slate-400/25 px-5 py-4 sm:px-8 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
