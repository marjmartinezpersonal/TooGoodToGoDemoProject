import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { HOME_SLUG } from "@/lib/links";
import { GLOBAL_SLUG, getStory } from "@/lib/storyblok";

export default async function StoryPage({ params, searchParams }: PageProps<"/[[...slug]]">) {
  const { slug } = await params;
  const storySlug = slug?.join("/") || HOME_SLUG;

  // The Global story only exists to edit the header and footer, so visitors get a 404.
  // The Visual Editor loads it with a `_storyblok` query parameter.
  if (storySlug === GLOBAL_SLUG && !(await searchParams)._storyblok) notFound();

  const story = await getStory(storySlug);

  if (!story) notFound();

  return <StoryblokStory story={story} />;
}
