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
  Calendar,
} from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { localizeCategory, localizeEmirate, localizeBasicInfo, localizeBenefit, localizeObjective, localizeContact } from '@/lib/localize-category';
import { pickLocalized } from '@/lib/auto-translate';
import Reveal from '@/components/shared/Reveal';
import Button from '@/components/shared/Button';
import InitiativeApplicationForm from '@/components/InitiativeApplicationForm';
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

function formatDate(value: string | null | undefined, isArabic?: boolean) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
  const title = initiative ? pickLocalized(initiative.title, initiative.titleAr, isArabic) : '';
  const subtitle = initiative ? pickLocalized(initiative.subtitle, (initiative as any).subtitleAr, isArabic) : '';
  const description = initiative ? pickLocalized(initiative.description, (initiative as any).descriptionAr, isArabic) : '';
  const purpose = initiative ? pickLocalized(initiative.purpose, (initiative as any).purposeAr, isArabic) : '';
  const badge = initiative ? pickLocalized(initiative.badge, (initiative as any).badgeAr, isArabic) : '';
  const websiteLabel = initiative
    ? pickLocalized(initiative.websiteButtonLabel, initiative.websiteButtonLabelAr, isArabic)
    : '';

  const supports = t.raw('supports') as string[];
  const supportList = initiative
    ? Object.entries(initiative.supportOffered ?? {})
        .filter(([, enabled]) => enabled)
        .map(([key]) => supports[SUPPORT_INDEX[key] ?? -1])
        .filter(Boolean)
    : [];

  const basicInfo = (() => {
    if (!initiative) return [];
    const ar = initiative.basicInformationAr;
    if (isArabic && ar?.length) return ar;
    const list = initiative.basicInformation?.length ? initiative.basicInformation : [];
    return isArabic ? list.map((v) => localizeBasicInfo(v, true)) : list;
  })();
  const objectives = (() => {
    if (!initiative) return [];
    const ar = (initiative as any).objectivesAr as string[] | undefined;
    if (isArabic && ar?.length) return ar;
    const list = (initiative.objectives ?? []) as string[];
    return isArabic ? list.map((v) => localizeObjective(v, true)) : list;
  })();
  const benefits: string[] = (() => {
    if (!initiative) return [];
    const ar = (initiative as any).benefitsAr as string[] | undefined;
    if (isArabic && ar?.length) return ar;
    const list = (initiative.benefits ?? []) as string[];
    return isArabic ? list.map((v) => localizeBenefit(v, true)) : list;
  })();
  const contacts = (() => {
    if (!initiative) return [];
    const ar = initiative.contactAr;
    if (isArabic && ar?.length) return ar;
    const list = initiative.contact?.length ? initiative.contact : [];
    return isArabic ? list.map((v) => localizeContact(String(v), true)) : list;
  })();

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
                    {badge && (
                      <span className="rounded-full bg-[#781E36] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                        {badge}
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
                  {subtitle && (
                    <p className="max-w-[872px] text-sm md:text-base leading-relaxed text-white/90">
                      {subtitle}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[40px] text-sm text-white/90">
                    {initiative.category && (
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{localizeCategory(initiative.category, isArabic)}</span>
                      </span>
                    )}
                    {[formatDate(initiative.startDate, isArabic), formatDate(initiative.endDate, isArabic)].filter(Boolean).length > 0 && (
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#E8CFC1]" />
                        {[formatDate(initiative.startDate, isArabic), formatDate(initiative.endDate, isArabic)].filter(Boolean).join(' — ')}
                      </span>
                    )}
                    {initiative.emirates && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#E8CFC1]" />
                        {localizeEmirate(initiative.emirates, isArabic)}
                      </span>
                    )}
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
                        {websiteLabel || t('visitOfficial')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            {initiative.showAbout && (initiative.description || initiative.purpose || objectives.length > 0) && (
              <Reveal delay={0.15} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('aboutTitle')}</h2>
                  </div>
                  {description && (
                    <p className="text-base leading-[30px] text-[#757575]">{description}</p>
                  )}
                  {purpose && (
                    <>
                      <h3 className="mt-8 text-xl font-semibold text-black leading-[30px]">{t('purpose')}</h3>
                      <p className="mt-1 text-base leading-[30px] text-[#757575]">{purpose}</p>
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

            {initiative.showSupportOffered && supportList.length > 0 && (
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

            {initiative.showBenefits && benefits.length > 0 && (
              <Reveal delay={0.3} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('benefits')}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit: string, i: number) => (
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
                      {websiteLabel || t('visitWebsite')}
                    </a>
                  )}
                </section>
              </Reveal>
            )}

            {initiative.showApplicationForm && (
              <Reveal delay={0.35} direction="up">
                <section className="w-full rounded-[20px] bg-white p-6 sm:p-10">
                  <div className="border-b border-[#E8CFC1] pb-[10px] mb-6">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('applyNow') ?? 'Apply Now'}</h2>
                  </div>
                  <InitiativeApplicationForm initiativeId={initiative.id} />
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
