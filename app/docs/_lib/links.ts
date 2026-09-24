import path from "node:path";
import { docHref } from "./pages";

// The Markdown links to files the way GitHub reads them, such as `../developers/setup.md`.
// These helpers map those paths to the /docs routes. `dir` is the linking file's folder.

const isRelative = (url: string) => !/^([a-z][a-z\d+.-]*:|\/|#)/i.test(url);

/** Maps a link to another Markdown file to its /docs page, keeping any #anchor. */
export function resolveHref(href: string, dir: string) {
  if (!isRelative(href)) return href;
  const [file, hash] = href.split("#");
  if (!file.endsWith(".md")) return href;
  const slug = path.posix.join(dir, file).replace(/\.md$/, "").replace(/^README$/, "");
  return docHref(slug) + (hash ? `#${hash}` : "");
}

/** Maps an image in docs/images to the route that serves it. */
export function resolveImage(src: string, dir: string) {
  if (!isRelative(src)) return src;
  const file = path.posix.join(dir, src);
  return file.startsWith("images/") ? `/docs/${file}` : src;
}
