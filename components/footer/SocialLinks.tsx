import { storyblokEditable } from "@storyblok/react/rsc";
import { type SimpleIcon, siFacebook, siInstagram, siTiktok, siX, siYoutube } from "simple-icons";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";

// Keys match the `platform` option values in the social_link schema.
const icons: Record<string, SimpleIcon> = {
  facebook: siFacebook,
  instagram: siInstagram,
  tiktok: siTiktok,
  x: siX,
  youtube: siYoutube,
};

export default function SocialLinks({ links }: { links: Block<"social_link">[] }) {
  return (
    <ul aria-label="Social media" className="flex flex-wrap items-start gap-3 self-start">
      {links.map((item) => {
        const icon = icons[item.platform];
        if (!icon) return null;
        return (
          <li key={item._uid} {...storyblokEditable(item)}>
            <StoryblokLink
              link={item.link}
              aria-label={icon.title}
              className="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-800 transition hover:bg-zinc-300"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d={icon.path} />
              </svg>
            </StoryblokLink>
          </li>
        );
      })}
    </ul>
  );
}
