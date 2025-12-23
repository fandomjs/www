import type { Metadata } from "next";
import PixelBackground from "../../components/pixel-bg.client";

export const metadata: Metadata = {
  title: "Fandom.js — The Ultimate SDK for Fandom & MediaWiki",
  description:
    "The most advanced JavaScript SDK for Fandom & MediaWiki. Type-safe structures, event-driven workflows, and seamless read/write access make interacting with wikis effortless.",
  openGraph: {
    title: "Fandom.js — The Ultimate SDK for Fandom & MediaWiki",
    description:
      "The most advanced JavaScript SDK for Fandom & MediaWiki. Type-safe structures, event-driven workflows, and seamless read/write access make interacting with wikis effortless.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fandom.js — The Ultimate SDK for Fandom & MediaWiki",
    description:
      "The most advanced JavaScript SDK for Fandom & MediaWiki. Type-safe structures, event-driven workflows, and seamless read/write access make interacting with wikis effortless.",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-start py-12 px-6 sm:px-8 md:px-16 lg:px-24">
      <div className="relative flex flex-col w-full max-w-5xl lg:max-w-342 h-auto md:h-160 items-center justify-center px-6 sm:px-12 md:px-16 py-12 md:py-20 bg-neutral-100 dark:bg-neutral-950 border border-black/10 dark:border-white/5 rounded-2xl md:rounded-[3rem] shadow-lg">
        <PixelBackground />
        <div className="absolute top-0 left-0 inset-0 w-full h-full bg-neutral-100/20 dark:bg-neutral-950/20 backdrop-blur-[2px] rounded-2xl md:rounded-[3rem] pointer-events-none" />
        <h1 className="z-10 text-3xl sm:text-4xl md:text-6xl lg:text-7xl uppercase max-w-4xl text-center font-bold mb-4 text-neutral-600 dark:text-neutral-400">
          The Ultimate SDK for
          <span className="text-black dark:text-white">
            {" "}
            Fandom & MediaWiki.
          </span>
        </h1>
        <p className="hidden lg:block z-10 text-neutral-700 dark:text-neutral-300 text-center max-w-3xl px-4">
          The most advanced JavaScript SDK for Fandom & MediaWiki. Type-safe
          structures, event-driven workflows, and seamless read/write access
          make interacting with wikis effortless.
        </p>
        <div className="z-10 flex flex-row flex-wrap items-center justify-center mt-6 sm:mt-8 gap-2 lg:gap-4">
          <a
            href="/docs/fandomjs/installation"
            className="px-6 py-2 sm:px-8 sm:py-3 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded-full hover:bg-black hover:dark:bg-white transition"
          >
            Get Started
          </a>
          <a
            href="/docs/fandomjs/configuration"
            className="px-6 py-2 sm:px-8 sm:py-3 bg-neutral-400/60 dark:bg-neutral-800/60 backdrop-blur-md text-neutral-900 dark:text-neutral-100 rounded-full hover:bg-neutral-400 hover:dark:bg-neutral-800 transition"
          >
            Configuration
          </a>
        </div>
      </div>

      <footer className="flex flex-col items-center justify-center w-full mt-8 py-6 text-center text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          Made with
          <img
            draggable="false"
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png"
            alt="heart"
            className="inline w-5 h-5 sm:w-6 sm:h-6"
          />
          by Ferotiq &amp; ByJonas
        </div>
        <div className="text-xs sm:text-sm mt-1">& fandom.js Contributors</div>
      </footer>
    </main>
  );
}
