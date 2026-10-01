import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="w-full flex-1">
            {children}
          </main>
          <footer className="border-t border-slate-400/25 py-8">
            <div className="mx-auto max-w-5xl px-4 text-sm text-neutral-500 sm:px-6">
              {/*
                Deliberately inconspicuous door to the admin page. It is a real
                link, so keyboard and screen-reader users can still reach it,
                but it is styled to read as plain text: no underline, the same
                colour on hover, and `cursor-default` so the pointer never
                changes to a hand. Nobody clicks it by accident.
              */}
              <Link
                href="/admin"
                className="cursor-default text-neutral-500 no-underline hover:text-neutral-500"
              >
                © {new Date().getFullYear()} {siteConfig.name}
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
