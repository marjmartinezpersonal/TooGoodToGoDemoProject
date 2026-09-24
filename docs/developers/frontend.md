# Render the Header and Footer with Next.js

The website uses Next.js. In Next.js, a layout wraps every page below it, which fits a header and footer that appear on every page. The [`@storyblok/react/rsc` package](https://www.storyblok.com/docs/libraries/js/react-sdk) shows Storyblok content with React Server Components, and live editing in the Visual Editor still works.

## Fetch the global settings

The `lib/storyblok.ts` file sets up the Storyblok SDK with [`storyblokInit`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokinit) and adds a `getStory` helper. React’s `cache` function makes sure the `global` story loads once per request, even though both the layout and the page metadata need it:

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

The `version` parameter decides which content loads: drafts during development, and published content in production. The `resolve_links: "url"` parameter adds each linked story’s current address to the response. The [Retrieve a single story reference](https://www.storyblok.com/docs/api/content-delivery/v2/stories/retrieve-a-single-story#query-parameters) explains both.

## Wrap every page in the header and footer

One route, `app/[[...slug]]`, serves every story. It’s an optional catch-all route, which means it matches every URL, including the homepage. This follows Storyblok’s [dynamic routing guide for Next.js](https://www.storyblok.com/docs/guides/nextjs/dynamic-routing). Its layout loads the global settings and puts the header and footer around the page:

```tsx
// app/[[...slug]]/layout.tsx
import Footer from "@/components/footer/Footer";
import Header from "@/components/navigation/Header";
import VisualEditorLinkGuard from "@/components/storyblok/VisualEditorLinkGuard";
import { GLOBAL_SLUG, getGlobalSettings } from "@/lib/storyblok";

export default async function StoryLayout({ children, params }: LayoutProps<"/[[...slug]]">) {
  const { slug } = await params;

  // The Global story renders its own live-editable header and footer (see GlobalSettings).
  if (slug?.join("/") === GLOBAL_SLUG) {
    return (
      <>
        <VisualEditorLinkGuard />
        {children}
      </>
    );
  }

  const settings = await getGlobalSettings();

  return (
    <>
      <VisualEditorLinkGuard />
      {settings && <Header settings={settings} />}
      {children}
      {settings && <Footer settings={settings} />}
    </>
  );
}
```

The early return for the `global` story matters for live editing. When an editor opens that story in the Visual Editor, the page shows it through [`StoryblokStory`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokstory), and the `GlobalSettings` component draws the header and footer from the draft. If the layout added its own header and footer too, the preview would show two of each.

`VisualEditorLinkGuard` stops links from leaving the page inside the Visual Editor, so selecting a link opens its block in the form. A `not-found.tsx` file in the same folder keeps the header and footer on 404 pages.

## Render the three navigation levels

Each menu level has its own component, the same way the schema has its own block for each level. `NavigationButton` shows columns, `NavigationPanelColumn` shows links, and it stops there, because the schema stops there. No component needs to call itself.

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

The [`storyblokEditable`](https://www.storyblok.com/docs/libraries/js/react-sdk#storyblokeditable) attributes let editors select each item in the Visual Editor preview.

A top-level item without columns is a normal link. A top-level item with columns becomes a `button` that opens and closes a dropdown, following the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), a standard way to build show-and-hide menus that work with screen readers. One element can’t both open a menu and go to a page, so the item’s own link moves into the dropdown as an “Explore” link.

`NavDisclosure` is the only part of the header that runs in the browser. It sets `aria-expanded` and `aria-controls` on the button, so screen readers know whether the menu is open. It closes the dropdown when the visitor presses **Escape**, selects outside it, moves focus away, or follows a link. In the Visual Editor, it stays open while the editor works in the form. Column headings use `p` elements, with `aria-labelledby` on their lists, instead of `h2` headings, so menu labels don’t crowd the page’s heading outline.

## Turn links into URLs

Every link in the header and footer goes through one function, `resolveLink`, in `lib/links.ts`. It turns a Storyblok Link field into a URL the browser can use:

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

The function handles these cases:

- **Links to stories** use the story’s current `full_slug`, so they keep working after an editor renames or moves the story. The saved `cached_url` is only a backup.
- **The homepage story** links to `/` instead of `/homepage`.
- **Anchors** on a story link go at the end of the URL, such as `#section`.
- **Web addresses without `https://`** get it added. Otherwise, `google.com` would become a link to `/google.com` on this website.

The `StoryblokLink` component then shows internal links with Next.js’s `Link` component, which changes pages without a full reload. External links use a plain `a` element with `rel="noopener noreferrer"`, a safety setting for links to other websites.

## Render the footer

Each `footer_column` becomes a `nav` element, labeled by its `h2` heading. The newsletter and social links follow as more items in the same grid, so all footer headings line up in one row on wide screens. Each social icon comes from the [simple-icons](https://simpleicons.org) package and has an `aria-label` with the platform name, because screen readers can’t describe an icon on their own.

If something doesn’t work as described, [troubleshoot the project](troubleshooting.md).
