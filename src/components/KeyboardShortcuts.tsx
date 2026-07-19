"use client";

import { useEffect } from "react";

export default function KeyboardShortcuts() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "/") return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();
      const search = document.querySelector<HTMLElement>(
        '[data-shortcut="search"]'
      );
      search?.focus();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return null;
}
