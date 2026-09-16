'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { pickLocalized } from '@/lib/auto-translate';
import { getPresentation, type PagePresentation } from '@/lib/api/presentations';

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
  notFound: boolean;
  presentation: PagePresentation | null;
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
    notFound: false,
    presentation: null,
  });

  const fallbackTitle = fallback.title;
  const fallbackDescription = fallback.description;
  const fallbackHero = fallback.heroImage;
  const fallbackBadge = fallback.badge;

  useEffect(() => {
    let mounted = true;
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
    fetch(`${API_URL}/presentations/${encodeURIComponent(key)}`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          if (mounted) setData((s) => ({ ...s, loading: false, notFound: true }));
          return null;
        }
        if (!res.ok) {
          if (mounted) setData((s) => ({ ...s, loading: false }));
          return null;
        }
        return res.json() as Promise<PagePresentation>;
      })
      .then((p) => {
        if (!mounted || !p) return;
        setData({
          title: pickLocalized(p.title, p.titleAr, isArabic) || fallbackTitle,
          description: pickLocalized(p.description, p.descriptionAr, isArabic) || fallbackDescription,
          heroImage: p.heroImage || fallbackHero,
          badge: p.badge || fallbackBadge || null,
          loading: false,
          notFound: false,
          presentation: p,
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
