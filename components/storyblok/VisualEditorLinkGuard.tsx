"use client";

import { isVisualEditor } from "@storyblok/react";
import { useEffect } from "react";

/**
 * In the Visual Editor, selecting a link should open its block in the form, not
 * navigate the preview away from the story being edited. The capture listener runs
 * before React's handlers, so Next.js's Link sees `defaultPrevented` and stays put,
 * while the click still reaches the Storyblok Bridge.
 */
export default function VisualEditorLinkGuard() {
  useEffect(() => {
    if (!isVisualEditor()) return;

    function preventNavigation(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest("a[href]")) event.preventDefault();
    }

    document.addEventListener("click", preventNavigation, { capture: true });
    return () => document.removeEventListener("click", preventNavigation, { capture: true });
  }, []);

  return null;
}
