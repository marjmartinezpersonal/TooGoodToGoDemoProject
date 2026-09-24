import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocsMarkdown from "../_components/DocsMarkdown";
import DocsNav from "../_components/DocsNav";
import { getTocItems } from "../_lib/headings";
import { DOC_GROUPS, docFile, findDoc } from "../_lib/pages";

type Props = PageProps<"/docs/[[...slug]]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = findDoc(slug?.join("/") ?? "");
  return { title: doc?.slug ? `${doc.label} · Tutorial` : "Tutorial" };
}

export default async function DocsPage({ params }: Props) {
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
        <DocsMarkdown markdown={markdown} dir={path.posix.dirname(file)} />
      </article>
    </main>
  );
}
