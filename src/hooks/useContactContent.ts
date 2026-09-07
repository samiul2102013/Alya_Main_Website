'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getContactContent, type ContactContent } from '@/lib/api/contact';

export interface ContactData {
  content: ContactContent | null;
  loading: boolean;
  localize: (en: string, ar: string) => string;
}

export function useContactContent(): ContactData {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getContactContent()
      .then((c) => { if (mounted) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: string, ar: string): string => {
    if (isArabic && ar) return ar;
    return en || '';
  };

  return { content, loading, localize };
}
