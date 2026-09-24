"use client";

import type { storyblokEditable } from "@storyblok/react/rsc";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

type NavDisclosureProps = {
  label: string;
  /** Visual Editor attributes from `storyblokEditable`, computed on the server. */
  editable: ReturnType<typeof storyblokEditable>;
  children: ReactNode;
};

/**
 * Disclosure pattern: a real <button> toggles the panel and reports its state
 * through aria-expanded. Escape, a pointer press outside, moving focus out, or
 * following a link inside the panel closes it. Focus leaving the whole window,
 * such as into the Visual Editor's form, keeps it open.
 */
export default function NavDisclosure({ label, editable, children }: NavDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      {...editable}
      onBlur={() => {
        // Wait for focus to settle: when the window itself loses focus, the active element stays inside.
        requestAnimationFrame(() => {
          if (!rootRef.current?.contains(document.activeElement)) setOpen(false);
        });
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex items-center gap-1 rounded-md px-3 py-2 font-medium hover:bg-white/10"
      >
        {label}
        <span aria-hidden="true" className={open ? "rotate-180 transition" : "transition"}>
          ▾
        </span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        onClick={(event) => {
          // VisualEditorLinkGuard prevents navigation in the Visual Editor, so the panel stays open there.
          if (!event.defaultPrevented && (event.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className="absolute right-0 z-20 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-200 bg-white p-6 text-zinc-900 shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}
