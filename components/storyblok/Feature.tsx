import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";

type FeatureBlok = SbBlokData & { name?: string };

export default function Feature({ blok }: { blok: FeatureBlok }) {
  return (
    <div {...storyblokEditable(blok)}>
      <h2>{blok.name}</h2>
    </div>
  );
}
