import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";
import { resolveLink } from "@/lib/links";
import NavDisclosure from "./NavDisclosure";
import NavigationPanelColumn from "./NavigationPanelColumn";

const itemClassName = "block rounded-md px-3 py-2 font-medium hover:bg-white/10";

/** A top-level item: a plain link when it has no panel, a disclosure button when it does. */
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
      {/* A button can't also be a link, so the top-level item's own page becomes the panel's first stop. */}
      {resolveLink(blok.link) && (
        <StoryblokLink
          link={blok.link}
          className="mt-6 block border-t border-zinc-200 pt-4 text-sm font-semibold hover:underline"
        >
          Explore {blok.label}
        </StoryblokLink>
      )}
    </NavDisclosure>
  );
}
