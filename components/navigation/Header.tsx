import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import Link from "next/link";
import type { Block } from "@/.storyblok/schema/schema";
import NavigationButton from "./NavigationButton";

export default function Header({ settings }: { settings: Block<"global_settings"> }) {
  return (
    <header className="site-header sticky top-0 z-30 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt={settings.site_title ?? "Home"} width={50} height={40} priority />
        </Link>
        {settings.nav?.map((navigation) => (
          <nav key={navigation._uid} aria-label="Main" {...storyblokEditable(navigation)}>
            <ul className="flex flex-wrap items-center gap-2">
              {navigation.buttons?.map((button) => (
                <li key={button._uid}>
                  <NavigationButton blok={button} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </header>
  );
}
