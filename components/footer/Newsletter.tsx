import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";

export default function Newsletter({ blok }: { blok: Block<"newsletter"> }) {
  return (
    <div {...storyblokEditable(blok)} className="flex flex-col">
      {blok.heading && <h2 className="mb-3 text-sm font-semibold text-zinc-900">{blok.heading}</h2>}
      {blok.text && <p className="mb-4 text-sm">{blok.text}</p>}
      <StoryblokLink
        link={blok.button_link}
        className="self-start rounded-full bg-[var(--theme-header-background-color-dark)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {blok.button_label || "Sign up"}
      </StoryblokLink>
    </div>
  );
}
