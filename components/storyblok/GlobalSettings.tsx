import { storyblokEditable } from "@storyblok/react/rsc";
import type { Block } from "@/.storyblok/schema/schema";
import Footer from "@/components/footer/Footer";
import Header from "@/components/navigation/Header";

/**
 * Renders when editors open the Global story in the Visual Editor, so header
 * and footer changes preview live. On every other page, the [[...slug]] layout
 * renders the published header and footer instead.
 */
export default function GlobalSettings({ blok }: { blok: Block<"global_settings"> }) {
  return (
    <div {...storyblokEditable(blok)} className="flex min-h-screen flex-col">
      <Header settings={blok} />
      <main className="grid flex-1 place-items-center p-12 text-center text-zinc-500">
        <p>This story holds the site-wide header and footer. Changes here appear on every page.</p>
      </main>
      <Footer settings={blok} />
    </div>
  );
}
