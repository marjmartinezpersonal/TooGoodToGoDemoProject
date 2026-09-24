import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import StoryblokLink from "@/components/StoryblokLink";
import Newsletter from "./Newsletter";
import SocialLinks from "./SocialLinks";

export default function Footer({ settings }: { settings: Block<"global_settings"> }) {
  const newsletter = settings.newsletter?.[0];
  const socialLinks = settings.social_links ?? [];

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 text-zinc-700">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-4">
        {settings.footer?.map((column) => {
          const headingId = `footer-column-${column._uid}`;
          return (
            <nav
              key={column._uid}
              aria-labelledby={column.heading ? headingId : undefined}
              {...storyblokEditable(column)}
            >
              {column.heading && (
                <h2 id={headingId} className="mb-3 text-sm font-semibold text-zinc-900">
                  {column.heading}
                </h2>
              )}
              <ul className="flex flex-col gap-2 text-sm">
                {column.items?.map((item) => (
                  <li key={item._uid} {...storyblokEditable(item)}>
                    <StoryblokLink link={item.link} className="hover:underline">
                      {item.label}
                    </StoryblokLink>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
        {newsletter && <Newsletter blok={newsletter} />}
        {socialLinks.length > 0 && <SocialLinks links={socialLinks} />}
      </div>
    </footer>
  );
}
