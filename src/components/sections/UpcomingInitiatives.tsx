'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Button from '../shared/Button';
import Heading from '../shared/Heading';
import { Link } from '@/i18n/navigation';
import { getFeaturedInitiative, type PublicInitiativeDetail } from '@/lib/api/initiatives';

function formatDetails(initiative: PublicInitiativeDetail | null) {
  if (!initiative) return '';
  return [initiative.category, initiative.emirates, initiative.startDate, initiative.endDate]
    .filter(Boolean)
    .join(' • ');
}

export default function UpcomingInitiatives() {
  const t = useTranslations('home');
  const { content, localize, loading: homepageLoading } = useHomepageContent();
  const [initiative, setInitiative] = useState<PublicInitiativeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFeaturedInitiative()
      .then((item) => {
        if (!cancelled) setInitiative(item);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionTitle = localize(content?.initiativesTitle ?? '', content?.initiativesTitleAr ?? '') || t('initiativesTitle');
  const sectionSubtitle = localize(content?.initiativesSubtitle ?? '', content?.initiativesSubtitleAr ?? '') || t('initiativesSubtitle');
  const ctaLabel = localize(content?.initiativesCtaLabel ?? '', content?.initiativesCtaLabelAr ?? '') || t('initiativesCta');

  const fallbackList = (t.raw('initiatives') as Array<{
    badge: string;
    title: string;
    description: string;
    details: string;
    ctaLabel: string;
  }>) || [];
  const fallbackItem = fallbackList[0] || {
    badge: 'Registration Open',
    title: 'Mawaddah National Family Preparedness Program',
    description: 'A comprehensive 4-week interactive workshop series covering effective communication, emotional intelligence, conflict resolution, and financial budgeting for engaged couples.',
    details: 'Starts Aug 15 • Virtual & In-Person across Abu Dhabi & Dubai',
    ctaLabel: 'Learn More & Register',
  };

  const title = initiative?.title || fallbackItem.title;
  const badge = initiative?.badge || fallbackItem.badge;
  const description = initiative?.subtitle || initiative?.description || fallbackItem.description;
  const details = initiative ? formatDetails(initiative) : fallbackItem.details;
  const image = initiative?.coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=900&auto=format&fit=crop';
  const ctaHref = initiative?.slug ? `/initiatives/${initiative.slug}` : '/initiatives';

  return (
    <Section background="default" spacing="none" id="initiatives" containerClassName="!max-w-[1440px]" className="py-[64px] sm:py-[80px]">
      <div className="flex flex-col gap-[48px] max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <Heading level={2} align="center" subtitle={sectionSubtitle}>
            {sectionTitle}
          </Heading>
        </Reveal>

        <Reveal direction="up">
          <div
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
      </div>
    </Section>
  );
}
