'use client';

import { usePathname } from 'next/navigation';

export function NavTitle() {
  const pathname = usePathname();
  const isFandomJsDocs = pathname?.startsWith('/docs/fandom-api-types');

  return isFandomJsDocs ? 'fandom-api-types Docs' : 'fandom.js Docs';
}
