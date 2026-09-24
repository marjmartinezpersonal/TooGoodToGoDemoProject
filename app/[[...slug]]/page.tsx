import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { HOME_SLUG } from "@/lib/links";
import { getStory } from "@/lib/storyblok";

export default async function StoryPage({ params }: PageProps<"/[[...slug]]">) {
  const { slug } = await params;
  const story = await getStory(slug?.join("/") || HOME_SLUG);

  if (!story) notFound();

  return <StoryblokStory story={story} />;
}
