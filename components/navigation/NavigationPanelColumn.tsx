import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";

export default function NavigationPanelColumn({ blok }: { blok: Block<"navigation-panel-column"> }) {
  const headingId = `nav-column-${blok._uid}`;

  return (
    <div {...storyblokEditable(blok)} className="min-w-40">
      {/* Not an <h2>: menu labels would otherwise flood the page's heading outline. */}
      {blok.heading && (
        <p id={headingId} className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          {blok.heading}
        </p>
      )}
      <ul aria-labelledby={blok.heading ? headingId : undefined} className="flex flex-col gap-1">
        {blok.items?.map((item) => (
          <li key={item._uid} {...storyblokEditable(item)}>
            <StoryblokLink link={item.link} className="block py-1 hover:underline">
              {item.label}
            </StoryblokLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
