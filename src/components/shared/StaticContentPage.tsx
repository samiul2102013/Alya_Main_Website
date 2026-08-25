'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Breadcrumb from './Breadcrumb';
import Reveal from './Reveal';
import Container from './Container';
import { getPrivacyPolicy, getTerms, type PublicStaticPage } from '@/lib/api/settings';

interface StaticContentPageProps {
  type: 'privacy' | 'terms';
}

export default function StaticContentPage({ type }: StaticContentPageProps) {
  const t = useTranslations('static');
  const tNav = useTranslations('nav');
  const [data, setData] = useState<PublicStaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const result = type === 'privacy' ? await getPrivacyPolicy() : await getTerms();
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [type]);

  const title = type === 'privacy' ? t('privacyTitle') : t('termsTitle');

  return (
    <div className="bg-[#FAEDE6]">
      <Container className="pt-5 pb-3">
        <Breadcrumb items={[{ label: tNav('home'), href: '/' }, { label: title }]} />
      </Container>

      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[40px] leading-snug mb-8">
              {title}
            </h1>
            {loading ? (
              <p className="text-[#6B5B57] text-base">{t('loading')}</p>
            ) : data?.content ? (
              <div
                className="prose prose-p:text-[#6B5B57] prose-headings:text-[#781E36] max-w-none text-base leading-[28px] text-[#6B5B57]"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            ) : (
              <p className="text-[#6B5B57] text-base">{t('empty')}</p>
            )}
            <div className="mt-10">
              <Link
                href="/"
                className="flex h-[56px] w-full sm:w-[260px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors"
              >
                {t('backHome')}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}