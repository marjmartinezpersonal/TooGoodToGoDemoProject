import { Children, isValidElement, type ReactNode } from "react";

export type TocItem = { id: string; label: string };

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

/** Turns a heading into its anchor id, matching GitHub's, so links between pages work here and on GitHub. */
export function slugify(node: ReactNode) {
  return textOf(node)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

/** Lists a page's h2 sections for the sidebar, skipping lines inside code blocks. */
export function getTocItems(markdown: string): TocItem[] {
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
