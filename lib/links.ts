import type { MultilinkFieldValue } from "@storyblok/schema";

/** The story served at "/". */
export const HOME_SLUG = "homepage";

export type ResolvedLink = {
  href: string;
  external: boolean;
  target?: string;
};

// With `resolve_links: "url"`, story links carry the linked story's current slug,
// which stays correct after the story is moved or renamed (unlike `cached_url`).
type ResolvedStory = { full_slug?: string };

/**
 * Turns a multilink field value into an href. The schema only allows story and
 * URL links, so any other link type resolves to null.
 */
export function resolveLink(link: MultilinkFieldValue | null | undefined): ResolvedLink | null {
  if (!link) return null;

  if (link.linktype === "story") {
    const story = (link as unknown as { story?: ResolvedStory }).story;
    const slug = (story?.full_slug ?? link.cached_url)?.replace(/\/$/, "");
    if (!slug) return null;
    const path = slug === HOME_SLUG ? "/" : `/${slug}`;
    return {
      href: link.anchor ? `${path}#${link.anchor}` : path,
      external: false,
      target: link.target,
    };
  }

  if (link.linktype === "url" && link.url) {
    // Editors often type "example.com"; without a scheme the browser treats it as a relative path.
    const href = /^([a-z][a-z\d+.-]*:|\/|#)/i.test(link.url) ? link.url : `https://${link.url}`;
    return { href, external: /^https?:\/\//i.test(href), target: link.target };
  }

  return null;
}
