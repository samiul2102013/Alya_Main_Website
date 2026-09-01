'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getHomepageContent } from '@/lib/api/homepage';
import type { HomepageContent, StatItem, FloatingCard } from '@/lib/api/homepage';

export interface HomepageData {
  content: HomepageContent | null;
  loading: boolean;
  /** Locale-aware helper: returns Arabic value if locale is 'ar' and Arabic value exists, else English */
  localize: (en: string, ar: string) => string;
  /** Get stats array, returns empty array if no content */
  stats: StatItem[];
  /** Get floating cards, returns empty array if no content */
  floatingCards: FloatingCard[];
}

/**
 * Fetch homepage content from the backend.
 * Provides locale-aware localization helper and structured data accessors.
 * Falls back to empty strings when backend has no content yet.
 */
export function useHomepageContent(): HomepageData {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getHomepageContent()
      .then((c) => { if (mounted) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: string, ar: string): string => {
    if (isArabic && ar) return ar;
    return en || '';
  };

  return {
    content,
    loading,
    localize,
    stats: content?.stats ?? [],
    floatingCards: content?.heroFloatingCards ?? [],
  };
}
