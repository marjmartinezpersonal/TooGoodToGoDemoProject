import {
  type SbBlokData,
  StoryblokServerComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";

type GridBlok = SbBlokData & { columns?: SbBlokData[] };

export default function Grid({ blok }: { blok: GridBlok }) {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.columns?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
