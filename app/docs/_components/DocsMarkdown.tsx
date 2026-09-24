import rehypeShiki from "@shikijs/rehype";
import { MarkdownAsync, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "../_lib/headings";
import { resolveHref, resolveImage } from "../_lib/links";

/** Styles for elements that need no path handling. */
const staticComponents: Components = {
  h1: ({ children }) => <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900">{children}</h1>,
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
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b-2 border-zinc-300 px-3 py-2 font-semibold text-zinc-900">{children}</th>,
  td: ({ children }) => <td className="border-b border-zinc-200 px-3 py-2 align-top">{children}</td>,
};

/** Renders one tutorial page. `dir` is the page's folder inside docs/, used to resolve relative links and images. */
export default function DocsMarkdown({ markdown, dir }: { markdown: string; dir: string }) {
  const components: Components = {
    ...staticComponents,
    a: ({ href, children }) => (
      <a
        href={href && resolveHref(href, dir)}
        className="font-medium text-(--theme-header-background-color-dark) underline underline-offset-2"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element -- Markdown images have no known dimensions.
      <img
        src={typeof src === "string" ? resolveImage(src, dir) : src}
        alt={alt ?? ""}
        className="my-6 w-full rounded-lg border border-zinc-200"
      />
    ),
  };

  return (
    <MarkdownAsync
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeShiki, { theme: "github-dark-default" }]]}
      components={components}
    >
      {markdown}
    </MarkdownAsync>
  );
}
