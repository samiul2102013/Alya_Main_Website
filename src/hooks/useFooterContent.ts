'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getFooterContent, type FooterContent } from '@/lib/api/footer';

export function useFooterContent(initialContent?: FooterContent | null): {
  content: FooterContent | null;
  localize: (en: string, ar: string) => string;
} {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [content, setContent] = useState<FooterContent | null>(initialContent ?? null);

  useEffect(() => {
    // If server-prefetched content is available (from layout.tsx), skip client
    // fetch on first render — avoids duplicate request and FOUC.
    // Still revalidate in background if no initial data (e.g. direct nav).
    if (initialContent !== undefined && initialContent !== null) return;
    let mounted = true;
    getFooterContent()
      .then((c) => { if (mounted) setContent(c); })
      .catch(() => {})
    return () => { mounted = false; };
  }, [initialContent]);

  const localize = (en: string, ar: string): string => {
    if (isArabic && ar) return ar;
    return en || '';
  };

  return { content, localize };
}
