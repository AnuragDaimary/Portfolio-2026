import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";

import { Cursor } from "@/components/Cursor";
import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/content/site";
import { themeBootstrap } from "@/lib/theme";

import "./globals.css";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Designer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Designer`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
};

// Runs before first paint: applies the theme with no flash (light 07:00–19:59, dark otherwise,
// by the viewer's local clock; a manual toggle lasts until the next switch time), and
// stops the browser restoring the previous scroll position (a reload always starts at the top,
// and drops any #hash), and sets html.rules (hairline animation) / html.loading + html.intro (loader) unless reduced motion.
const themeScript = `(function(){try{history.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"&&location.hash)history.replaceState(null,"",location.pathname+location.search)}catch(e){}${themeBootstrap}if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var h=document.documentElement;h.classList.add("rules","loading","intro");setTimeout(function(){if(!h.dataset.motion)h.classList.remove("rules","loading","intro")},8000)}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the script above sets data-theme before React hydrates.
    <html
      lang="en"
      className={`${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* suppressHydrationWarning: browser extensions often inject their own <script> into
            <head> before hydration, which would otherwise trigger a (harmless) mismatch error. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top">
        <Loader />
        <Cursor />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {/* Header is fixed and sits outside the smoother; the spacer in the
            scrolled content reserves its height. */}
        <Header />
        <SmoothScroll>
          <div className="header-spacer" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
