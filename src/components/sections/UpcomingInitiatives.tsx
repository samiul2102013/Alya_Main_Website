'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { localizeCategory, localizeTitle } from '@/lib/localize-category';
import { pickLocalized } from '@/lib/auto-translate';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Button from '../shared/Button';
import Heading from '../shared/Heading';
import Pagination from '../shared/Pagination';
import { Link } from '@/i18n/navigation';
import { getPublishedInitiativesPage, type PublicInitiative } from '@/lib/api/initiatives';

const ITEMS_PER_PAGE = 1;

interface FallbackInitiative {
  badge: string;
  title: string;
  description: string;
  details: string;
  ctaLabel: string;
}

function formatDetails(initiative: PublicInitiative | null, isArabic: boolean) {
  if (!initiative) return '';
  const category = localizeCategory(initiative.category, isArabic);
  return [category, initiative.emirates, initiative.startDate, initiative.endDate]
    .filter(Boolean)
    .join(' • ');
}

export default function UpcomingInitiatives() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { content, localize } = useHomepageContent();
  const [items, setItems] = useState<PublicInitiative[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    getPublishedInitiativesPage({ page: String(page), perPage: String(ITEMS_PER_PAGE), listed: '1' })
      .then(({ data, meta }) => {
        if (cancelled) return;
        setItems(data);
        setTotalPages(Math.max(1, meta.totalPages));
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setTotalPages(1);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    // Bug-11 pattern: after changing page, scroll back to the top of this
    // section so the new initiative is visible without manual scrolling.
    requestAnimationFrame(() => {
      document.getElementById('initiatives')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const sectionTitle = localize(content?.initiativesTitle ?? '', content?.initiativesTitleAr ?? '') || t('initiativesTitle');
  const sectionSubtitle = localize(content?.initiativesSubtitle ?? '', content?.initiativesSubtitleAr ?? '') || t('initiativesSubtitle');
  const ctaLabel = localize(content?.initiativesCtaLabel ?? '', content?.initiativesCtaLabelAr ?? '') || t('initiativesCta');

  const fallbackList = (t.raw('initiatives') as FallbackInitiative[]) || [];
  const usingFallback = items.length === 0;
  const fallbackTotalPages = Math.max(1, fallbackList.length);
  const effectiveTotalPages = usingFallback ? fallbackTotalPages : totalPages;
  const safePage = Math.min(page, effectiveTotalPages);

  const initiative: PublicInitiative | null = usingFallback ? null : (items[0] ?? null);
  const fallbackItem: FallbackInitiative = fallbackList[safePage - 1] ||
    fallbackList[0] || {
      badge: 'Registration Open',
      title: 'Mawaddah National Family Preparedness Program',
      description: 'A comprehensive 4-week interactive workshop series covering effective communication, emotional intelligence, conflict resolution, and financial budgeting for engaged couples.',
      details: 'Starts Aug 15 • Virtual & In-Person across Abu Dhabi & Dubai',
      ctaLabel: 'Learn More & Register',
    };

  const title = initiative ? localizeTitle(initiative.title, initiative.titleAr, isArabic) : fallbackItem.title;
  const badge = initiative
    ? pickLocalized(initiative.badge, initiative.badgeAr, isArabic) || fallbackItem.badge
    : fallbackItem.badge;
  const description = initiative
    ? localizeTitle(initiative.subtitle || '', initiative.subtitleAr || '', isArabic) || fallbackItem.description
    : fallbackItem.description;
  const details = initiative ? formatDetails(initiative, isArabic) : fallbackItem.details;
  const image = initiative?.coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=900&auto=format&fit=crop';
  const ctaHref = initiative?.slug ? `/initiatives/${initiative.slug}` : '/initiatives';

  return (
    <Section background="default" spacing="none" id="initiatives" containerClassName="!max-w-[1440px]" className="py-[64px] sm:py-[80px] scroll-mt-20">
      <div className="flex flex-col gap-[48px] max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <Heading level={2} align="center" subtitle={sectionSubtitle}>
            {sectionTitle}
          </Heading>
        </Reveal>

        <Reveal direction="up">
          <div
            key={initiative?.slug ?? `fallback-${safePage}`}
            className="group grid overflow-hidden rounded-[32px] border border-[#E8CFC1] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#781E36] lg:grid-cols-[1.1fr_0.9fr]"
            style={{
              boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.1), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="relative min-h-[280px] sm:min-h-[360px] overflow-hidden bg-gray-900">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 610px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#98142f] via-[#781E36] to-[#3f1220]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {badge && (
                <span className="absolute top-4 left-4 rounded-full bg-[#781E36] px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug group-hover:text-[#781E36] transition-colors">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm md:text-base leading-relaxed text-[#6B5B57] line-clamp-4">
                    {description}
                  </p>
                )}

                {details && (
                  <div className="mt-3 flex items-start gap-2 text-xs font-bold text-[#781E36] bg-[#FAEDE6] p-3 rounded-xl border border-[#E8CFC1]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#781E36] mt-0.5" />
                    <span>{details}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={ctaHref}
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  icon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
                >
                  {ctaLabel}
                </Button>
                <Link
                  href="/initiatives"
                  className="inline-flex h-[56px] items-center justify-center rounded-full border border-[#781E36] px-6 text-sm font-bold text-[#781E36] transition-colors hover:bg-[#FAEDE6]"
                >
                  {t('initiativesTitle')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bug-12: paginated browsing of initiatives directly from the homepage. */}
        {effectiveTotalPages > 1 && (
          <Reveal direction="up">
            <Pagination page={safePage} totalPages={effectiveTotalPages} onChange={handlePageChange} />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
