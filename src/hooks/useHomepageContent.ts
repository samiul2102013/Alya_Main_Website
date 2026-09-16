'use client';
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { pickLocalized } from '@/lib/auto-translate';
import {
  DEFAULT_SECTION_VISIBILITY,
  getHomepageContent,
  resolveSectionVisibility,
  type FloatingCard,
  type HomepageContent,
  type SectionVisibility,
  type StatItem,
} from '@/lib/api/homepage';

export interface HomepageData {
  content: HomepageContent | null;
  loading: boolean;
  notFound: boolean;
  /** Locale-aware helper: returns Arabic value if locale is 'ar' and Arabic value exists, else English */
  localize: (en: unknown, ar: unknown) => string;
  /** Get stats array, returns empty array if no content */
  stats: StatItem[];
  /** Get floating cards, returns empty array if no content */
  floatingCards: FloatingCard[];
  /** Per-section on/off switches from the admin panel. Missing keys default to true. */
  sectionVisibility: SectionVisibility;
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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
    fetch(`${API_URL}/homepage`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          if (mounted) setNotFound(true);
          return null;
        }
        if (!res.ok) return null;
        return res.json() as Promise<HomepageContent>;
      })
      .then((c) => { if (mounted && c) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: unknown, ar: unknown): string => pickLocalized(en, ar, isArabic);

  const sectionVisibility = useMemo<SectionVisibility>(
    () => resolveSectionVisibility(content?.sectionVisibility ?? null),
    [content?.sectionVisibility],
  );

  return {
    content,
    loading,
    notFound,
    localize,
    stats: content?.stats ?? [],
    floatingCards: content?.heroFloatingCards ?? [],
    sectionVisibility,
  };
}

export { DEFAULT_SECTION_VISIBILITY };
