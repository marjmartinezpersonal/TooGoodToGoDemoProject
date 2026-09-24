import type { MultilinkFieldValue } from "@storyblok/schema";
import Link from "next/link";
import type { ComponentProps } from "react";
import { resolveLink } from "@/lib/links";

type StoryblokLinkProps = Omit<ComponentProps<"a">, "href" | "target"> & {
  link: MultilinkFieldValue | null | undefined;
};

/** Internal links use client-side navigation; external links open without leaking the opener. */
export default function StoryblokLink({ link, children, ...props }: StoryblokLinkProps) {
  const resolved = resolveLink(link);

  if (!resolved) {
    return <span className={props.className}>{children}</span>;
  }

  if (resolved.external) {
    return (
      <a href={resolved.href} target={resolved.target} rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={resolved.href} target={resolved.target} {...props}>
      {children}
    </Link>
  );
}
