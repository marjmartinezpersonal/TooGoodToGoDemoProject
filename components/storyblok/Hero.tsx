import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";
import { resolveLink } from "@/lib/links";

export default function Hero({ blok }: { blok: Block<"hero"> }) {
  const image = blok.background_image?.filename;
  const hasButton = Boolean(blok.button_label && resolveLink(blok.button_link));

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative flex min-h-[60vh] flex-1 items-center justify-center bg-zinc-900 bg-cover bg-center px-6 text-center text-white"
      style={image ? { backgroundImage: `url(${image}/m/)` } : undefined}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative flex max-w-3xl flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{blok.headline}</h1>
        {hasButton && (
          <StoryblokLink
            link={blok.button_link}
            className="rounded-full bg-white px-6 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            {blok.button_label}
          </StoryblokLink>
        )}
      </div>
    </section>
  );
}
