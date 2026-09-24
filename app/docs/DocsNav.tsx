"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { docHref, type DocGroup } from "./pages";

export type TocItem = { id: string; label: string };

// A heading counts as the current section once it scrolls within this distance of the top.
const ACTIVE_OFFSET = 120;

const activeClassName =
  "border-[var(--theme-header-background-color-dark)] font-semibold text-[var(--theme-header-background-color-dark)]";
const idleClassName = "border-transparent text-zinc-600 hover:border-zinc-400 hover:text-zinc-900";

export default function DocsNav({
  groups,
  currentSlug,
  headings,
}: {
  groups: DocGroup[];
  currentSlug: string;
  headings: TocItem[];
}) {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      let current: string | undefined;
      for (const item of headings) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top <= ACTIVE_OFFSET) current = item.id;
      }
      setActiveId(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [headings]);

  const nav = (
    <div className="space-y-6 text-sm">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{group.label}</p>
          <ul className="border-l border-zinc-200">
            {group.pages.map((page) => {
              const isCurrent = page.slug === currentSlug;
              return (
                <li key={page.slug}>
                  <Link
                    href={docHref(page.slug)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 transition ${
                      isCurrent && !activeId ? activeClassName : isCurrent ? "border-transparent font-semibold text-zinc-900" : idleClassName
                    }`}
                  >
                    {page.label}
                  </Link>
                  {isCurrent && headings.length > 0 && (
                    <ol className="mb-2">
                      {headings.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            aria-current={item.id === activeId ? "location" : undefined}
                            className={`-ml-px block border-l-2 py-1 pl-7 transition ${
                              item.id === activeId ? activeClassName : idleClassName
                            }`}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <details className="mb-10 rounded-lg border border-zinc-200 p-4 lg:hidden">
        <summary className="cursor-pointer font-semibold text-zinc-900">Tutorial pages</summary>
        <nav aria-label="Tutorial pages" className="mt-4">
          {nav}
        </nav>
      </details>
      <nav
        aria-label="Tutorial pages"
        className="sticky top-8 hidden max-h-[calc(100vh-4rem)] overflow-y-auto lg:block"
      >
        {nav}
      </nav>
    </>
  );
}
