'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { pickLocalized } from '@/lib/auto-translate';
import { getAboutContent, type AboutContent, type AboutOffering, type AboutImpact } from '@/lib/api/about';

export interface AboutData {
  content: AboutContent | null;
  loading: boolean;
  notFound: boolean;
  /** Locale-aware helper: returns Arabic value if locale is 'ar' and Arabic value exists, else English */
  localize: (en: unknown, ar: unknown) => string;
  /** Localize an offering row (title + description, both en+ar) */
  localizeOffering: (o: AboutOffering) => { title: string; desc: string };
  /** Localize an impact stat (label + value, both en+ar) */
  localizeImpact: (i: AboutImpact) => { label: string; value: string };
}

export function useAboutContent(): AboutData {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
    fetch(`${API_URL}/about`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          if (mounted) setNotFound(true);
          return null;
        }
        if (!res.ok) return null;
        return res.json() as Promise<AboutContent>;
      })
      .then((c) => { if (mounted && c) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: unknown, ar: unknown): string => pickLocalized(en, ar, isArabic);

  const localizeOffering = (o: AboutOffering) => ({
    title: pickLocalized(o.title, o.titleAr, isArabic),
    desc: pickLocalized(o.desc, o.descAr, isArabic),
  });

  const localizeImpact = (i: AboutImpact) => ({
    label: pickLocalized(i.label, i.labelAr, isArabic),
    value: pickLocalized(i.value, i.valueAr, isArabic),
  });

  return { content, loading, notFound, localize, localizeOffering, localizeImpact };
}
