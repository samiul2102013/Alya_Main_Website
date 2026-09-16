'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { pickLocalized } from '@/lib/auto-translate';
import { getContactContent, type ContactContent } from '@/lib/api/contact';

export interface ContactData {
  content: ContactContent | null;
  loading: boolean;
  notFound: boolean;
  localize: (en: unknown, ar: unknown) => string;
}

export function useContactContent(): ContactData {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
    fetch(`${API_URL}/contact`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          if (mounted) setNotFound(true);
          return null;
        }
        if (!res.ok) return null;
        return res.json() as Promise<ContactContent>;
      })
      .then((c) => { if (mounted && c) setContent(c); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const localize = (en: unknown, ar: unknown): string => pickLocalized(en, ar, isArabic);

  return { content, loading, notFound, localize };
}
