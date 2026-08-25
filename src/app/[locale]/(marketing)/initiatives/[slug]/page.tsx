'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Loader2,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  Calendar,
} from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import Button from '@/components/shared/Button';
import { getInitiativeBySlug, type PublicInitiativeDetail } from '@/lib/api/initiatives';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
];

const CONTACT_ICONS = [Building2, Phone, Mail, MapPin, Clock];

const SUPPORT_INDEX: Record<string, number> = {
  financial_support: 0,
  housing_support: 1,
  educational_support: 2,
  marriage_training_program: 3,
  pre_marital_preparation: 4,
};

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function InitiativeDetailsPage() {
  const t = useTranslations('initiative');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [initiative, setInitiative] = useState<PublicInitiativeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getInitiativeBySlug(slug)
      .then((item) => {
        if (mounted) setInitiative(item);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const isArabic = locale === 'ar';
  const title = initiative
    ? isArabic && initiative.titleAr
      ? initiative.titleAr
      : initiative.title
    : '';

  const supports = t.raw('supports') as string[];
  const supportList = initiative
    ? Object.entries(initiative.supportOffered ?? {})
        .filter(([, enabled]) => enabled)
        .map(([key]) => supports[SUPPORT_INDEX[key] ?? -1])
        .filter(Boolean)
    : [];

  const basicInfo = initiative?.basicInformation?.length ? initiative.basicInformation : [];
  const objectives = initiative?.objectives?.length ? initiative.objectives : [];
  const benefits = initiative?.benefits?.length ? initiative.benefits : [];
  const contacts = initiative?.contact?.length ? initiative.contact : [];

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('initiatives'), href: '/initiatives' },
              { label: title || t('title') },
            ]}
          />
        </div>
      </Reveal>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
        </div>
      ) : !initiative ? (
        <div className="flex justify-center py-24">
          <p className="text-base font-normal text-[#6B5B57]">{t('notFound')}</p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-[40px] w-full">
            <Reveal delay={0.1} direction="up">
              <div className="relative min-h-[360px] md:h-[460px] w-full rounded-[20px] overflow-hidden bg-gray-900">
                <Image
                  src={initiative.coverImage || FALLBACK_IMAGES[0]}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="1280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    {initiative.badge && (
                      <span className="rounded-full bg-[#781E36] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                        {initiative.badge}
                      </span>
                    )}
                    {initiative.isFeatured && (
                      <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-[#781E36] shadow-sm">
                        {t('featured')}
                      </span>
                    )}
                  </div>
                  <h1 className="max-w-[872px] text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight">
                    {title}
                  </h1>
                  {initiative.subtitle && (
                    <p className="max-w-[872px] text-sm md:text-base leading-relaxed text-white/90">
                      {isArabic && initiative.subtitleAr ? initiative.subtitleAr : initiative.subtitle}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[40px] text-sm text-white/90">
                    {initiative.category && (
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{initiative.category}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#E8CFC1]" />
                      {[formatDate(initiative.startDate), formatDate(initiative.endDate)].filter(Boolean).join(' — ') ||
                        initiative.emirates}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-[40px]">
                    {initiative.officialWebsiteUrl && (
                      <a
                        href={initiative.officialWebsiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                        {t('visitOfficial')}
                      </a>
                    )}
                    <a
                      href={initiative.shareUrl || '#'}
                      className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[20px] border-2 border-white/60 bg-white/10 px-[10px] text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      {t('shareInitiative')}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {(initiative.description || initiative.purpose || objectives.length > 0) && (
              <Reveal delay={0.15} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('aboutTitle')}</h2>
                  </div>
                  {initiative.description && (
                    <p className="text-base leading-[30px] text-[#757575]">{initiative.description}</p>
                  )}
                  {initiative.purpose && (
                    <>
                      <h3 className="mt-8 text-xl font-semibold text-black leading-[30px]">{t('purpose')}</h3>
                      <p className="mt-1 text-base leading-[30px] text-[#757575]">{initiative.purpose}</p>
                    </>
                  )}
                  {objectives.length > 0 && (
                    <>
                      <h3 className="mt-6 text-xl font-semibold text-black leading-[30px]">{t('objective')}</h3>
                      <ul className="mt-2 flex flex-col gap-1">
                        {objectives.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-base leading-[30px] text-[#757575]">
                            <span className="mt-[9px] h-[10px] w-[10px] shrink-0 rounded-full bg-[#781E36]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              </Reveal>
            )}

            {basicInfo.length > 0 && (
              <Reveal delay={0.2} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('basicInfo')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {basicInfo.map((item, i) => (
                      <div key={i} className="flex items-center gap-[12px]">
                        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#E8CFC1] p-[7px]">
                          <Building2 className="h-5 w-5 text-[#781E36]" />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-[#781E36] leading-[28px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {supportList.length > 0 && (
              <Reveal delay={0.25} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('supportOffered')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                    {supportList.map((label, i) => (
                      <div key={i} className="flex items-center gap-[10px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#781E36]" />
                        <span className="text-sm md:text-base font-semibold text-[#781E36] leading-7">{label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {benefits.length > 0 && (
              <Reveal delay={0.3} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('benefits')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex gap-[10px] rounded-[16px] border border-[#E8CFC1] bg-white p-[10px]">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#781E36] mt-1" />
                        <span className="text-base font-semibold text-[#781E36] leading-[30px]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {contacts.length > 0 && (
              <Reveal delay={0.35} direction="up">
                <section className="w-full rounded-[20px] bg-[#781E36] p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-white">{t('contactInfo')}</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                    {contacts.map((item, i) => {
                      const Icon = CONTACT_ICONS[i % CONTACT_ICONS.length];
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0 text-[#E8CFC1]" />
                          <span className="text-base font-semibold text-white leading-7">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  {initiative.officialWebsiteUrl && (
                    <a
                      href={initiative.officialWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex h-[52px] items-center justify-center rounded-md border border-white px-6 text-base font-semibold text-white hover:bg-white hover:text-[#781E36] transition-colors"
                    >
                      {t('visitWebsite')}
                    </a>
                  )}
                </section>
              </Reveal>
            )}

            <Reveal delay={0.4} direction="up">
              <div className="flex justify-center pt-2">
                <Button href="/initiatives" size="lg" variant="primary">
                  {t('backToInitiatives')}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}
