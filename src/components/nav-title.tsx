"use client";

import { usePathname } from "next/navigation";

export function NavTitle() {
  const pathname = usePathname();
  const isFandomJsDocs = pathname?.startsWith("/docs/fandom-api-types");
  const isBasePath =
    pathname === "/" || pathname === "/docs" || pathname === "/docs/";

  if (isBasePath) {
    return "Fandom.js";
  }

  return isFandomJsDocs ? "fandom-api-types Docs" : "fandom.js Docs";
}
