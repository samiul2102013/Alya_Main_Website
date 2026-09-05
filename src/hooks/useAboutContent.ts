'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getAboutContent, type AboutContent, type AboutOffering, type AboutImpact } from '@/lib/api/about';

export interface AboutData {
  content: AboutContent | null;
  loading: boolean;
  /** Locale-aware helper: returns Arabic value if locale is 'ar' and Arabic value exists, else English */
  localize: (en: string, ar: string) => string;
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

  useEffect(() => {
    let mounted = true;
    getAboutContent()
      .then((c) => { if (mounted) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: string, ar: string): string => {
    if (isArabic && ar) return ar;
    return en || '';
  };

  const localizeOffering = (o: AboutOffering) => ({
    title: isArabic && o.titleAr ? o.titleAr : o.title,
    desc: isArabic && o.descAr ? o.descAr : o.desc,
  });

  const localizeImpact = (i: AboutImpact) => ({
    label: isArabic && i.labelAr ? i.labelAr : i.label,
    value: isArabic && i.valueAr ? i.valueAr : i.value,
  });

  return { content, loading, localize, localizeOffering, localizeImpact };
}
