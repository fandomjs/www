import Link from 'next/link';

const links = [
  { href: '/docs/fandomjs', label: 'Fandom.js Docs' },
  { href: '/docs/fandom-api-types', label: 'Type Reference' },
];

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="max-w-2xl space-y-4">
        <p className="uppercase text-sm tracking-[0.3em] text-slate-500">Fandom + MediaWiki SDK</p>
        <h1 className="text-4xl font-extrabold">Build bots and tools with fandom.js</h1>
        <p className="text-lg text-slate-500">
          Typed managers for pages, users, revisions, categories, events, and more. Learn how the request
          manager, rate limiter, and structures work together, then plug them into your wiki automations.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-slate-900/10 bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="https://github.com/fandomjs/fandom.js"
          className="rounded-full border border-slate-900/20 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900/40"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </Link>
      </div>
    </section>
  );
}
