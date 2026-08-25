'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getPresentation } from '@/lib/api/presentations';

export interface PresentationFallback {
  title: string;
  description: string;
  heroImage: string;
  badge?: string;
}

export interface PagePresentationData {
  title: string;
  description: string;
  heroImage: string;
  badge: string | null;
  loading: boolean;
}

/**
 * Load the page presentation (hero title / description / image) from the backend for a
 * given section. Localizes using the active locale and falls back to the provided i18n
 * strings and a relevant hero image only when the backend has no content yet.
 */
export function usePagePresentation(
  key: string,
  fallback: PresentationFallback,
): PagePresentationData {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [data, setData] = useState<PagePresentationData>({
    title: fallback.title,
    description: fallback.description,
    heroImage: fallback.heroImage,
    badge: fallback.badge ?? null,
    loading: true,
  });

  const fallbackTitle = fallback.title;
  const fallbackDescription = fallback.description;
  const fallbackHero = fallback.heroImage;
  const fallbackBadge = fallback.badge;

  useEffect(() => {
    let mounted = true;
    getPresentation(key)
      .then((p) => {
        if (!mounted || !p) return;
        setData({
          title: (isArabic && p.titleAr ? p.titleAr : p.title) || fallbackTitle,
          description: (isArabic && p.descriptionAr
            ? p.descriptionAr
            : p.description) || fallbackDescription,
          heroImage: p.heroImage || fallbackHero,
          badge: p.badge || fallbackBadge || null,
          loading: false,
        });
      })
      .catch(() => {
        if (mounted) setData((s) => ({ ...s, loading: false }));
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, locale, fallbackTitle, fallbackDescription, fallbackHero, fallbackBadge]);

  return data;
}
