export type DocPage = { slug: string; label: string };
export type DocGroup = { label: string; pages: DocPage[] };

// The sidebar order. Each slug maps to docs/<slug>.md, and the empty slug to docs/README.md.
export const DOC_GROUPS: DocGroup[] = [
  {
    label: "Overview",
    pages: [{ slug: "", label: "Introduction" }],
  },
  {
    label: "For content editors",
    pages: [{ slug: "editors/edit-the-header-and-footer", label: "Edit the header and footer" }],
  },
  {
    label: "For developers",
    pages: [
      { slug: "developers/setup", label: "Set up the project" },
      { slug: "developers/content-model", label: "Design the content model" },
      { slug: "developers/schema-as-code", label: "Manage the schema as code" },
      { slug: "developers/frontend", label: "Render with Next.js" },
      { slug: "developers/troubleshooting", label: "Troubleshooting" },
    ],
  },
];

export function docFile(slug: string) {
  return slug ? `${slug}.md` : "README.md";
}

export function docHref(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function findDoc(slug: string) {
  return DOC_GROUPS.flatMap((group) => group.pages).find((page) => page.slug === slug);
}
