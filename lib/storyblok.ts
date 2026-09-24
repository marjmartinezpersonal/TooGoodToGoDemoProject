import { apiPlugin, type ISbStoryData, storyblokInit } from "@storyblok/react/rsc";
import { cache } from "react";
import type { Block } from "@/.storyblok/schema/schema";
import Feature from "@/components/storyblok/Feature";
import GlobalSettings from "@/components/storyblok/GlobalSettings";
import Grid from "@/components/storyblok/Grid";
import Hero from "@/components/storyblok/Hero";
import Page from "@/components/storyblok/Page";
import Teaser from "@/components/storyblok/Teaser";

/** The story that holds the site-wide header and footer. */
export const GLOBAL_SLUG = "global";

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    // Must match your space's region: eu (default), us, ap, ca or cn
    region: process.env.STORYBLOK_REGION ?? "eu",
  },
  components: {
    feature: Feature,
    global_settings: GlobalSettings,
    grid: Grid,
    hero: Hero,
    page: Page,
    teaser: Teaser,
  },
});

/** Fetches a story once per request, however many server components ask for it. */
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
