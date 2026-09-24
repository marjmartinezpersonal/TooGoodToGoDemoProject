# Render the Header and Footer with Next.js

The frontend uses Next.js because the App Router’s nested layouts map directly onto a header and footer that wrap every page. The [`@storyblok/react/rsc` export](https://www.storyblok.com/docs/libraries/js/react-sdk) renders Storyblok content as React Server Components and still supports live editing in the Visual Editor.

## Fetch the global settings

The `lib/storyblok.ts` file initializes the SDK with [`storyblokInit`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokinit) and exposes a `getStory` helper. React’s `cache` function deduplicates the request, so the layout and the page metadata share one API call for the `global` story per request:

```ts
// lib/storyblok.ts
// ...

export const getStory = cache(async (slug: string): Promise<ISbStoryData | null> => {
  try {
    const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version: process.env.NODE_ENV === "production" ? "published" : "draft",
      resolve_links: "url",
    });
    return data.story;
  } catch {
    return null;
  }
});

export async function getGlobalSettings() {
  const story = await getStory(GLOBAL_SLUG);
  if (story?.content.component !== "global_settings") return null;
  return story.content as unknown as Block<"global_settings">;
}
```

The `version` parameter makes development builds read draft content and production builds read published content. The `resolve_links: "url"` parameter tells the API to attach the linked story’s current slug to every story link. The [Retrieve a single story reference](https://www.storyblok.com/docs/api/content-delivery/v2/stories/retrieve-a-single-story#query-parameters) documents both parameters.

## Wrap every page in the header and footer

A single optional catch-all route, `app/[[...slug]]`, serves every story, following Storyblok’s [dynamic routing guide for Next.js](https://www.storyblok.com/docs/guides/nextjs/dynamic-routing). Its layout fetches the global settings and wraps the page:

```tsx
// app/[[...slug]]/layout.tsx
import Footer from "@/components/footer/Footer";
import Header from "@/components/navigation/Header";
import { GLOBAL_SLUG, getGlobalSettings } from "@/lib/storyblok";

export default async function StoryLayout({ children, params }: LayoutProps<"/[[...slug]]">) {
  const { slug } = await params;

  // The Global story renders its own live-editable header and footer (see GlobalSettings).
  if (slug?.join("/") === GLOBAL_SLUG) return children;

  const settings = await getGlobalSettings();

  return (
    <>
      {settings && <Header settings={settings} />}
      {children}
      {settings && <Footer settings={settings} />}
    </>
  );
}
```

The early return matters for live editing. When an editor opens the `global` story in the Visual Editor, the page renders it through [`StoryblokStory`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokstory), and the registered `GlobalSettings` component draws the header and footer from the live draft. Skipping the layout’s copy on that route keeps the preview from showing two headers. A `not-found.tsx` file in the same folder keeps the header and footer on 404 pages.

## Render the three navigation levels

Each navigation level has its own component, mirroring the schema. The recursion question from a self-referencing model never comes up: `NavigationButton` renders columns, `NavigationPanelColumn` renders links, and the tree ends there because the schema ends there.

```tsx
// components/navigation/NavigationButton.tsx
// ...

export default function NavigationButton({ blok }: { blok: Block<"navigation-button"> }) {
  const columns = blok.panel ?? [];

  if (columns.length === 0) {
    return (
      <StoryblokLink link={blok.link} className={itemClassName} {...storyblokEditable(blok)}>
        {blok.label}
      </StoryblokLink>
    );
  }

  return (
    <NavDisclosure label={blok.label} editable={storyblokEditable(blok)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        {columns.map((column) => (
          <NavigationPanelColumn key={column._uid} blok={column} />
        ))}
      </div>
      {resolveLink(blok.link) && (
        <StoryblokLink link={blok.link} className="mt-6 block border-t pt-4 text-sm font-semibold">
          Explore {blok.label}
        </StoryblokLink>
      )}
    </NavDisclosure>
  );
}
```

The [`storyblokEditable`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokeditable) attributes let editors select each item in the Visual Editor preview. A top-level item without a panel renders as a plain link. A top-level item with a panel renders as a `button` that follows the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), because one element cannot both navigate and toggle a menu. The item’s own landing page moves into the panel as an “Explore” link, so the editor’s `link` value still reaches visitors.

`NavDisclosure` is the only client component in the header. It sets `aria-expanded` and `aria-controls` on the button and closes the panel when the visitor presses **Escape**, selects anywhere outside it, moves focus out of it, or follows a link inside it. Column headings render as `p` elements with `aria-labelledby` on their lists instead of `h2` elements, so menu labels don’t flood the page’s heading outline.

## Resolve multilink fields

Every link in the header and footer passes through one function, `resolveLink`, in `lib/links.ts`:

```ts
// lib/links.ts
// ...

export function resolveLink(link: MultilinkFieldValue | null | undefined): ResolvedLink | null {
  if (!link) return null;

  if (link.linktype === "story") {
    const story = (link as unknown as { story?: ResolvedStory }).story;
    const slug = (story?.full_slug ?? link.cached_url)?.replace(/\/$/, "");
    if (!slug) return null;
    const path = slug === HOME_SLUG ? "/" : `/${slug}`;
    return { href: link.anchor ? `${path}#${link.anchor}` : path, external: false, target: link.target };
  }

  if (link.linktype === "url" && link.url) {
    // Editors often type "example.com"; without a scheme the browser treats it as a relative path.
    const href = /^([a-z][a-z\d+.-]*:|\/|#)/i.test(link.url) ? link.url : `https://${link.url}`;
    return { href, external: /^https?:\/\//i.test(href), target: link.target };
  }

  return null;
}
```

The function handles the following cases:

- **Story links** use the resolved `full_slug`, which stays correct after an editor renames or moves the linked story. The stored `cached_url` only serves as a fallback.
- **The homepage story** maps to `/` instead of `/homepage`.
- **Anchors** set on a story link append as a URL fragment.
- **External URLs without a scheme** gain `https://`. Without that fix, a value such as `google.com` renders as a link to `/google.com` on the site itself.

The `StoryblokLink` component then renders internal links with Next.js’s `Link` component for client-side navigation, and external links as a plain `a` element with `rel="noopener noreferrer"`.

## Render the footer

The footer renders each `footer_column` as a `nav` element labeled by its `h2` heading, followed by the newsletter and the social links as further grid items, so all headings share one row on wide screens. Each social icon comes from the [simple-icons](https://simpleicons.org) package and carries an `aria-label` with the platform name, because a screen reader cannot announce an icon on its own.

If something doesn’t work as described, [troubleshoot the project](troubleshooting.md).
