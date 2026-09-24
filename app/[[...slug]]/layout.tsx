import Footer from "@/components/footer/Footer";
import Header from "@/components/navigation/Header";
import { GLOBAL_SLUG, getGlobalSettings } from "@/lib/storyblok";

export default async function StoryLayout({ children, params }: LayoutProps<"/[[...slug]]">) {
  const { slug } = await params;

  // The Global story renders its own live-editable header and footer (see GlobalSettings).
  if (slug?.join("/") === GLOBAL_SLUG) return children;

  const settings = await getGlobalSettings();

  return (
    <>
      {settings && <Header settings={settings} />}
      {children}
      {settings && <Footer settings={settings} />}
    </>
  );
}
