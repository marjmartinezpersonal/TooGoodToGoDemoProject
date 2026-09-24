import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";

type TeaserBlok = SbBlokData & { headline?: string };

export default function Teaser({ blok }: { blok: TeaserBlok }) {
  return (
    <div {...storyblokEditable(blok)}>
      <h2>{blok.headline}</h2>
    </div>
  );
}
