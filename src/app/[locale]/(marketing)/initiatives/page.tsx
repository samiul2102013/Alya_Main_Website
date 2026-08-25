'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Building2, Calendar, ExternalLink, HeartHandshake, Landmark, Loader2, MapPin, Phone, Mail, Shield, Users, Coins, BookOpen, Home, Heart, MessageCircle, Tag } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Button from '@/components/shared/Button';
import Reveal from '@/components/shared/Reveal';
import { Link } from '@/i18n/navigation';
import { getFeaturedInitiative, getInitiativeBySlug, type PublicInitiative, type PublicInitiativeDetail } from '@/lib/api/initiatives';

const SUPPORT_ICONS = [
  <Coins className="h-5 w-5" key="s0" />,
  <Home className="h-5 w-5" key="s1" />,
  <BookOpen className="h-5 w-5" key="s2" />,
  <Shield className="h-5 w-5" key="s3" />,
  <Heart className="h-5 w-5" key="s4" />,
  <MessageCircle className="h-5 w-5" key="s5" />,
];

const BENEFIT_ICONS = [
  <Coins className="h-5 w-5 text-[#781E36]" key="b0" />,
  <MessageCircle className="h-5 w-5 text-[#781E36]" key="b1" />,
  <Landmark className="h-5 w-5 text-[#781E36]" key="b2" />,
  <HeartHandshake className="h-5 w-5 text-[#781E36]" key="b3" />,
  <BookOpen className="h-5 w-5 text-[#781E36]" key="b4" />,
  <Users className="h-5 w-5 text-[#781E36]" key="b5" />,
];

const CONTACT_ICONS = [
  <Building2 className="h-5 w-5" key="c0" />,
  <Phone className="h-5 w-5" key="c1" />,
  <Mail className="h-5 w-5" key="c2" />,
  <MapPin className="h-5 w-5" key="c3" />,
  <Calendar className="h-5 w-5" key="c4" />,
];

const supportOrder = [
  'financial_support',
  'housing_support',
  'educational_support',
  'marriage_training_program',
  'pre_marital_preparation',
] as const;

function formatDate(value: string | null, locale: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function InitiativesPage() {
  const t = useTranslations('initiative');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const [featured, setFeatured] = useState<PublicInitiative | null>(null);
  const [initiative, setInitiative] = useState<PublicInitiativeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const featuredItem = await getFeaturedInitiative();
        if (!mounted) return;
        if (featuredItem?.slug) {
          const detail = await getInitiativeBySlug(featuredItem.slug);
          if (!mounted) return;
          setFeatured(detail ?? featuredItem);
          setInitiative(detail ?? null);
        }
      } catch {
        if (!mounted) return;
        setFeatured(null);
        setInitiative(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const detail = initiative;
  const isArabic = locale === 'ar';
  const title = detail
    ? isArabic && detail.titleAr
      ? detail.titleAr
      : detail.title
    : '';
  const subtitle = detail
    ? isArabic && detail.subtitleAr
      ? detail.subtitleAr
      : (detail.subtitle || detail.description)
    : '';

  const supports = useMemo(() => {
    if (!detail) return [];
    return supportOrder.filter((key) => detail.supportOffered?.[key]);
  }, [detail]);

  const supportLabels = t.raw('supports') as string[];
  const supportItems = supports.map(
    (key) => supportLabels[supportOrder.indexOf(key)],
  );

  const objectives = detail?.objectives ?? [];
  const basicInformation = detail?.basicInformation ?? [];
  const benefitItems = detail?.benefits ?? [];
  const contacts = detail?.contact ?? [];

  const basicInfo = useMemo(() => {
    if (!detail) return [];
    const rows = [
      {
        icon: <Building2 className="h-5 w-5 text-[#781E36]" />,
        label: t('organizer'),
        value: detail.officialWebsiteUrl,
      },
      { icon: <Tag className="h-5 w-5 text-[#781E36]" />, label: t('category'), value: detail.category },
      {
        icon: <Shield className="h-5 w-5 text-[#781E36]" />,
        label: t('programType'),
        value: detail.status,
      },
      { icon: <Users className="h-5 w-5 text-[#781E36]" />, label: t('eligibility'), value: detail.emirates },
      { icon: <HeartHandshake className="h-5 w-5 text-[#781E36]" />, label: t('supportType'), value: detail.badge },
      {
        icon: <Calendar className="h-5 w-5 text-[#781E36]" />,
        label: 'Dates',
        value: `${formatDate(detail.startDate || null, locale)}${
          detail.endDate ? ` - ${formatDate(detail.endDate, locale)}` : ''
        }`.trim(),
      },
    ];
    return rows.filter((row) => row.value);
  }, [detail, locale, t]);

  const showAbout =
    Boolean(detail?.description) ||
    Boolean(detail?.purpose) ||
    objectives.length > 0;

  if (loading) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
      </div>
    );
  }

  if (!featured || !detail) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen">
        <Reveal delay={0}>
          <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
            <Breadcrumb
              items={[
                { label: nav('home'), href: '/' },
                { label: nav('initiatives'), href: '/initiatives' },
                { label: t('currentInitiative') },
              ]}
            />
          </div>
        </Reveal>
        <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 py-24 flex flex-col items-center gap-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#781E36]">{t('currentInitiative')}</h1>
          <p className="max-w-[520px] text-base leading-relaxed text-[#6B5B57]">{t('noCurrentInitiative')}</p>
          <Link href="/initiatives" className="hidden" aria-hidden="true" />
          <Button href="/initiatives" variant="primary" size="lg">
            {t('browseInitiatives')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb
            items={[
              { label: nav('home'), href: '/' },
              { label: t('browseInitiatives'), href: '/initiatives' },
              { label: title },
            ]}
          />
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pb-16">
        <Reveal delay={0.1} direction="up">
          <div className="relative mx-auto w-full max-w-[1280px] min-h-[420px] md:h-[520px] rounded-[20px] overflow-hidden">
            {detail.coverImage ? (
              <Image src={detail.coverImage} alt={title} fill className="object-cover" sizes="1280px" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#98142f] via-[#781E36] to-[#3f1220]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30" />

            <div className="relative z-10 flex flex-col h-full max-w-[1145px] mx-auto px-5 py-8 sm:px-[45px] md:pt-[47px] md:pb-[47px]">
              <div className="flex flex-wrap items-start justify-start gap-3 md:gap-[25px]">
                {detail.badge && (
                  <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-[#781E36] shadow-sm">
                    {detail.badge}
                  </span>
                )}
                {detail.status && (
                  <span className="rounded-full bg-[#781E36] px-5 py-1.5 text-xs font-bold text-white shadow-md">
                    {detail.status}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-end gap-6 md:gap-[39px]">
                <div className="flex flex-col gap-6 max-w-[872px]">
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm md:text-base leading-relaxed text-white/90 max-w-[872px]">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-[40px]">
                  {detail.officialWebsiteUrl && (
                    <a
                      href={detail.officialWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      {t('visitOfficial')}
                    </a>
                  )}
                  {basicInformation.length > 0 && (
                    <Link
                      href={`/initiatives/${detail.slug}`}
                      className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] border-2 border-white/60 bg-white/10 px-[10px] text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                      {t('readFullArticle')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-12 mt-12">
          {detail.showAbout && showAbout && (
            <Reveal delay={0.2} direction="up">
              <section id="initiative-about" className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('aboutTitle')}</h2>
                  </div>

                  {detail.description && (
                    <div className="mt-6 max-w-[1185px]">
                      <p className="text-base leading-[30px] text-[#757575]">{detail.description}</p>
                    </div>
                  )}

                  {detail.purpose && (
                    <>
                      <h3 className="mt-8 max-w-[819px] text-xl font-semibold text-black leading-[30px]">
                        {t('purpose')}
                      </h3>
                      <p className="mt-1 max-w-[858px] text-base leading-[30px] text-[#757575]">
                        {detail.purpose}
                      </p>
                    </>
                  )}

                  {objectives.length > 0 && (
                    <>
                      <h3 className="mt-6 max-w-[819px] text-xl font-semibold text-black leading-[30px]">
                        {t('objective')}
                      </h3>
                      <ul className="mt-2 flex flex-col gap-1 max-w-[858px]">
                        {objectives.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-base leading-[30px] text-[#757575]">
                            <span className="mt-[9px] h-[10px] w-[10px] shrink-0 rounded-full bg-[#781E36]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </section>
            </Reveal>
          )}

          {basicInfo.length > 0 && (
            <Reveal delay={0.3} direction="up">
              <section className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('basicInfo')}</h2>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="flex flex-col gap-6">
                      {basicInfo.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-[12px] max-w-[369px]">
                          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#E8CFC1] p-[7px]">
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm md:text-base font-normal text-[#989898] leading-[28px]">{item.label}</span>
                            <span className="text-sm md:text-base font-semibold text-[#781E36] leading-[28px]">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-6">
                      {basicInfo.slice(3).map((item, i) => (
                        <div key={i} className="flex items-center gap-[12px] max-w-[369px]">
                          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#E8CFC1] p-[7px]">
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm md:text-base font-normal text-[#989898] leading-[28px]">{item.label}</span>
                            <span className="text-sm md:text-base font-semibold text-[#781E36] leading-[28px]">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {detail.showSupportOffered && supportItems.length > 0 && (
            <Reveal delay={0.35} direction="up">
              <section className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('supportOffered')}</h2>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                    {supportItems.map((label, i) => (
                      <div key={i} className="flex items-center gap-[10px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] w-full">
                        <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center text-[#781E36]">
                          {SUPPORT_ICONS[i % SUPPORT_ICONS.length]}
                        </div>
                        <span className="text-sm md:text-base font-semibold text-[#781E36] leading-7">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {detail.showBenefits && benefitItems.length > 0 && (
            <Reveal delay={0.4} direction="up">
              <section className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('benefits')}</h2>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benefitItems.map((benefit, i) => (
                      <div key={i} className="rounded-[12px] border border-[#E8CFC1] bg-[#FAFAFA] p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[#781E36]">{BENEFIT_ICONS[i % BENEFIT_ICONS.length]}</span>
                          <h4 className="font-semibold text-black">{benefit}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {contacts.length > 0 && (
            <Reveal delay={0.45} direction="up">
              <section className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('contactInfo')}</h2>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((value, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-[12px] border border-[#E8CFC1] bg-white p-4">
                        <span className="text-[#781E36]">{CONTACT_ICONS[i % CONTACT_ICONS.length]}</span>
                        <div>
                          <h4 className="font-semibold text-black">{t('contactInfo')}</h4>
                          <p className="text-[#757575]">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {detail.officialWebsiteUrl && (
            <Reveal delay={0.5} direction="up">
              <section className="w-full bg-white py-12 rounded-[20px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col gap-6">
                  <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
                    <h2 className="text-2xl font-bold text-[#781E36]">{t('ctaTitle')}</h2>
                  </div>
                  <p className="max-w-[1000px] text-base leading-7 text-[#757575]">
                    {t('ctaText')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={detail.officialWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-[56px] min-w-[210px] items-center justify-center gap-3 rounded-[12px] border-2 border-[#781E36] bg-[#781E36] px-[32px] py-[14px] text-base font-semibold text-white shadow-lg shadow-[#781E36]/25 transition-all duration-300 hover:bg-[#B83A4A] hover:border-[#B83A4A]"
                    >
                      {t('visitOfficialBtn')}
                      <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                    </a>
                  </div>
                </div>
              </section>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}