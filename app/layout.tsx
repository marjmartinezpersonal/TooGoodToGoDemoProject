import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getGlobalSettings } from "@/lib/storyblok";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  const siteTitle = settings?.site_title || "Storyblok site";

  return {
    title: { default: siteTitle, template: `%s | ${siteTitle}` },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
