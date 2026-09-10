'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getFooterContent, type FooterContent } from '@/lib/api/footer';

export function useFooterContent(): {
  content: FooterContent | null;
  localize: (en: string, ar: string) => string;
} {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    let mounted = true;
    getFooterContent()
      .then((c) => { if (mounted) setContent(c); })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);

  const localize = (en: string, ar: string): string => {
    if (isArabic && ar) return ar;
    return en || '';
  };

  return { content, localize };
}
