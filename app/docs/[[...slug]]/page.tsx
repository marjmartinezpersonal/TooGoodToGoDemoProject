import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Children, isValidElement, type ReactNode } from "react";
import { MarkdownAsync, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import DocsNav, { type TocItem } from "../DocsNav";
import { DOC_GROUPS, docFile, docHref, findDoc } from "../pages";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

// Matches GitHub's heading anchors, so links between pages work here and on GitHub.
function slugify(node: ReactNode) {
  return textOf(node)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

// Lists the h2 sections for the sidebar, skipping code blocks.
function getTocItems(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inCodeBlock = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) inCodeBlock = !inCodeBlock;
    else if (!inCodeBlock && line.startsWith("## ")) {
      const label = line.slice(3).replace(/`/g, "").trim();
      items.push({ id: slugify(label), label });
    }
  }
  return items;
}

const isRelative = (url: string) => !/^([a-z][a-z\d+.-]*:|\/|#)/i.test(url);

// The Markdown links to files the way GitHub reads them; this maps them to the docs routes.
function resolveHref(href: string, dir: string) {
  if (!isRelative(href)) return href;
  const [file, hash] = href.split("#");
  if (!file.endsWith(".md")) return href;
  const slug = path.posix.join(dir, file).replace(/\.md$/, "").replace(/^README$/, "");
  return docHref(slug) + (hash ? `#${hash}` : "");
}

function resolveImage(src: string, dir: string) {
  if (!isRelative(src)) return src;
  const file = path.posix.join(dir, src);
  return file.startsWith("images/") ? `/docs/${file}` : src;
}

function createComponents(dir: string): Components {
  return {
    h1: ({ children }) => (
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 id={slugify(children)} className="mt-14 mb-4 scroll-mt-6 border-b border-zinc-200 pb-2 text-2xl font-bold text-zinc-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={slugify(children)} className="mt-10 mb-3 scroll-mt-6 text-xl font-semibold text-zinc-900">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href && resolveHref(href, dir)}
        className="font-medium text-[var(--theme-header-background-color-dark)] underline underline-offset-2"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 leading-7">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 leading-7">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-5 py-1 text-zinc-800">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
        {children}
      </pre>
    ),
    code: ({ children }) => (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.875em] text-zinc-900">{children}</code>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element -- Markdown images have no known dimensions.
      <img
        src={typeof src === "string" ? resolveImage(src, dir) : src}
        alt={alt ?? ""}
        className="my-6 w-full rounded-lg border border-zinc-200"
      />
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b-2 border-zinc-300 px-3 py-2 font-semibold text-zinc-900">{children}</th>
    ),
    td: ({ children }) => <td className="border-b border-zinc-200 px-3 py-2 align-top">{children}</td>,
  };
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = findDoc(slug?.join("/") ?? "");
  return { title: doc && doc.slug ? `${doc.label} · Tutorial` : "Tutorial" };
}

export default async function DocsPage({ params }: PageProps<"/docs/[[...slug]]">) {
  const { slug } = await params;
  const doc = findDoc(slug?.join("/") ?? "");
  if (!doc) notFound();

  const file = docFile(doc.slug);
  const markdown = await readFile(path.join(process.cwd(), "docs", file), "utf8");

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-x-16 px-6 py-16 text-zinc-700 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside>
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <DocsNav groups={DOC_GROUPS} currentSlug={doc.slug} headings={getTocItems(markdown)} />
      </aside>
      <article className="max-w-3xl">
        <MarkdownAsync
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeShiki, { theme: "github-dark-default" }]]}
          components={createComponents(path.posix.dirname(file))}
        >
          {markdown}
        </MarkdownAsync>
      </article>
    </main>
  );
}
