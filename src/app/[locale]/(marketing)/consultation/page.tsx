'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ChevronDown, User, MapPin, Calendar, Clock, Building2, BadgeCheck, Wallet, Globe, Users, BookOpen, HelpCircle, Loader2, SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import Pagination from '@/components/shared/Pagination';
import { getPublishedConsultationsPage, type PublicConsultation } from '@/lib/api/consultations';
import { CONSULTATION_HERO_IMAGE, CONSULTATION_IMAGES } from '@/lib/image-pools';
import { usePagePresentation } from '@/hooks/usePagePresentation';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type Filter = { name: string; label: string; isDropdown: boolean; options: string[] };
interface Topic {
  title: string;
  videos: string;
}
interface Faq {
  question: string;
  answer: string;
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <ConsultationPageInner />
    </Suspense>
  );
}

function ConsultationPageInner() {
  const t = useTranslations('consultation');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<PublicConsultation[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid'>('all');
  const [filters, setFilters] = useState<{ marital: string; language: string; date: string }>({
    marital: '',
    language: '',
    date: '',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const presentation = usePagePresentation('consultation', {
    title: t('title'),
    description: t('description'),
    heroImage: CONSULTATION_HERO_IMAGE,
    badge: t('free'),
  });

  const sessionTabs = [
    { key: 'all' as const, label: t('allSessions') },
    { key: 'free' as const, label: t('freeSessions') },
    { key: 'paid' as const, label: t('paidSessions') },
  ];

  const filterDefs: Filter[] = [
    {
      name: 'marital',
      label: filters.marital || t('marital'),
      isDropdown: true,
      options: t.raw('maritalOptions') as string[],
    },
    {
      name: 'language',
      label: filters.language || t('language'),
      isDropdown: true,
      options: t.raw('languageOptions') as string[],
    },
    {
      name: 'date',
      label: filters.date || t('date'),
      isDropdown: true,
      options: t.raw('dateOptions') as string[],
    },
  ];

  function mapMarital(label: string): string {
    const mapping: Record<string, string> = {
      [t.raw('maritalOptions')[0]]: 'premarital',
      [t.raw('maritalOptions')[1]]: 'marital',
      [t.raw('maritalOptions')[2]]: 'postMarital',
    };
    return mapping[label] ?? label;
  }

  function mapLanguage(label: string): string {
    const mapping: Record<string, string> = {
      [t.raw('languageOptions')[0]]: 'ar',
      [t.raw('languageOptions')[1]]: 'en',
      [t.raw('languageOptions')[2]]: 'both',
    };
    return mapping[label] ?? label;
  }

  function mapDate(label: string): string {
    const mapping: Record<string, string> = {
      [t.raw('dateOptions')[0]]: 'week',
      [t.raw('dateOptions')[1]]: 'month',
      [t.raw('dateOptions')[2]]: 'year',
    };
    return mapping[label] ?? label;
  }

  function getSelectedValue(name: 'marital' | 'language' | 'date'): string {
    return filters[name];
  }

  const [searching, setSearching] = useState(false);

  function buildParams(q = searchText, f = filters, tab = activeTab, p = currentPage) {
    const params: Record<string, string> = {};
    if (q.trim()) params.search = q.trim();
    if (f.marital) params.marital_stage = mapMarital(f.marital);
    if (f.language) params.language = mapLanguage(f.language);
    if (f.date) params.date = mapDate(f.date);
    if (tab === 'free') params.free = 'true';
    if (tab === 'paid') params.free = 'false';
    params.page = String(p);
    params.perPage = String(perPage);
    return params;
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoaded(false);
      try {
        const pageRes = await getPublishedConsultationsPage(buildParams(searchText, filters, activeTab, currentPage));
        if (cancelled) return;
        setSessions(pageRes.data);
        setTotalPages(pageRes.meta?.totalPages ?? 1);
      } catch {
        if (!cancelled) {
          setSessions([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  function handleSearchWith(q: string) {
    setSearching(true);
    getPublishedConsultationsPage(buildParams(q, filters, activeTab, 1))
      .then((pageRes) => {
        setSessions(pageRes.data);
        setTotalPages(pageRes.meta?.totalPages ?? 1);
        setCurrentPage(1);
      })
      .catch(() => {
        setSessions([]);
        setTotalPages(1);
      })
      .finally(() => setSearching(false));
  }

  function handleSearch() {
    handleSearchWith(searchText.trim());
  }

  function handleApplyFilters() {
    setSearching(true);
    getPublishedConsultationsPage(buildParams(searchText, filters, activeTab, 1))
      .then((pageRes) => {
        setSessions(pageRes.data);
        setTotalPages(pageRes.meta?.totalPages ?? 1);
        setCurrentPage(1);
      })
      .catch(() => {
        setSessions([]);
        setTotalPages(1);
      })
      .finally(() => setSearching(false));
  }

  function handleResetFilters() {
    setSearchText('');
    setFilters({ marital: '', language: '', date: '' });
    setActiveTab('all');
    setOpenDropdown(null);
    setCurrentPage(1);
    setSearching(true);
    getPublishedConsultationsPage({ page: '1', perPage: String(perPage) })
      .then((pageRes) => {
        setSessions(pageRes.data);
        setTotalPages(pageRes.meta?.totalPages ?? 1);
      })
      .catch(() => {
        setSessions([]);
        setTotalPages(1);
      })
      .finally(() => setSearching(false));
  }

  const safePage = Math.min(currentPage, totalPages);
  const paged = sessions;

  // Hybrid content resolution: CMS wins, i18n is the fallback.
  const i18nTopics = t.raw('topics') as Topic[];
  const i18nFaqs = t.raw('faqs') as Faq[];

  const topics: Topic[] =
    (presentation.presentation?.consultationTopics?.length &&
      presentation.presentation.consultationTopics.map((topic) => ({
        title: (isArabic && topic.titleAr ? topic.titleAr : topic.title) || topic.title,
        videos: topic.videos ?? '',
      }))) ||
    i18nTopics;
  const contributorList: string[] =
    (presentation.presentation?.consultationContributors?.length &&
      presentation.presentation.consultationContributors) ||
    [];
  const faqs: Faq[] =
    (presentation.presentation?.consultationFaqs?.length &&
      presentation.presentation.consultationFaqs.map((faq) => ({
        question: isArabic && faq.questionAr ? faq.questionAr : faq.question,
        answer: isArabic && faq.answerAr ? faq.answerAr : faq.answer,
      }))) ||
    i18nFaqs;

  // Section visibility — default all to true if not set
  const secVis = presentation.presentation?.consultationSectionVisibility ?? {};
  const showHero = secVis.hero !== false;
  const showTopics = secVis.topics !== false;
  const showContributors = secVis.contributors !== false;
  const showFaqs = secVis.faqs !== false;
  const showCta = secVis.cta !== false;

  const topicIcons = [BookOpen, Users, HelpCircle, BadgeCheck];
  const contributorIcons = [BadgeCheck, User, Building2, Globe];

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: t('breadcrumbParent') },
          ]} />
        </div>
      </Reveal>

      {showHero && (
      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl lg:text-[40px] leading-tight">
                  {presentation.title}
                </h1>
                <p className="font-normal text-[#6B5B57] text-base md:text-lg leading-relaxed">
                  {presentation.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <Link
                    href="#sessions"
                    className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[16px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors"
                  >
                    {t('browseSessions')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </Link>
                  <Link
                    href="#learn-more"
                    className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[16px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors"
                  >
                    {t('learnMore')}
                  </Link>
                </div>
              </div>

              <div className="relative order-first md:order-last w-full max-w-[540px] mx-auto aspect-[4/5] max-h-[560px] rounded-[24px] overflow-hidden">
                <Image
                  src={presentation.heroImage}
                  alt={presentation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#781E36]/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      )}

      <div id="sessions" />
      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">
            {/* ROW 1: Search input + Search button */}
            <div className="flex items-center gap-[10px] w-full">
              <div className="flex items-center gap-[10px] flex-1 h-[48px] sm:h-[56px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
                <Search className="h-5 w-5 text-[#989898] shrink-0" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('searchPlaceholder')}
                  className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
                />
                {searchText && (
                  <button type="button" onClick={() => { setSearchText(''); handleSearchWith(''); }} className="shrink-0 text-[#989898] hover:text-[#781E36] cursor-pointer" aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="h-[48px] sm:h-[56px] px-6 rounded-[12px] bg-[#781E36] text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors shrink-0 flex items-center gap-2"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="hidden sm:inline">{t('search')}</span>
              </button>
            </div>

            {/* ROW 2: Filter dropdowns + Filter button + Reset button */}
            <div className="flex flex-col sm:flex-row gap-[10px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                {filterDefs.map((filter) => {
                  const selected = getSelectedValue(filter.name as 'marital' | 'language' | 'date');
                  const active = Boolean(selected);
                  return (
                    <div key={filter.name} className="relative w-full">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(filter.name)}
                        className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${
                          active || openDropdown === filter.name
                            ? 'border-[#781E36]'
                            : 'border-[#E8CFC1] hover:border-[#781E36]'
                        }`}
                      >
                        <span className={`text-sm truncate ${active ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                          {selected || filter.label}
                        </span>
                        {filter.isDropdown && (
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${openDropdown === filter.name ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>
                      {filter.isDropdown && openDropdown === filter.name && (
                        <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                          {filter.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setFilters((f) => ({ ...f, [filter.name]: opt }));
                                setOpenDropdown(null);
                              }}
                              className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-[10px] shrink-0">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="h-[48px] flex-1 sm:flex-none sm:w-[130px] rounded-[12px] bg-[#781E36] px-4 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  {t('search')}
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-[48px] px-4 rounded-[12px] bg-[#FAEDE6] text-sm font-bold text-[#781E36] border border-[#E8CFC1] hover:bg-[#F3D9CE] transition-colors"
                >
                  {t('reset')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.25} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[538px] h-auto rounded-[16px] border border-[#E8CFC1] bg-white p-2 mx-auto">
            {sessionTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`h-[48px] flex-1 rounded-[12px] px-4 inline-flex items-center justify-center whitespace-nowrap overflow-hidden text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-[#781E36] text-white shadow-sm'
                    : 'bg-transparent text-[#6B5B57] hover:text-[#781E36]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div id="learn-more" />
      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          {!loaded ? (
            <p className="text-center text-base font-normal text-[#6B5B57] py-10">Loading...</p>
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-base font-normal text-[#6B5B57]">No sessions found.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchText('');
                  setFilters({ marital: '', language: '', date: '' });
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
                className="h-[52px] rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {paged.map((card, i) => {
                const globalIndex = (safePage - 1) * perPage + i;
                const coverImg = card.coverImage || CONSULTATION_IMAGES[globalIndex % CONSULTATION_IMAGES.length];
                return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  className="flex flex-col w-full max-w-[400px] mx-auto rounded-[24px] border border-[#E8CFC1] bg-white overflow-hidden"
                  style={{
                    boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="relative w-full h-[224px] overflow-hidden bg-[#FAEDE6]">
                    <Image
                      src={coverImg}
                      alt={card.sessionTitle}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#781E36]/15 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex flex-col justify-between min-h-[110px]">
                      <h3 className="font-bold text-[#781E36] text-lg leading-[27px]">
                        {card.sessionTitle}
                      </h3>
                      {card.category && (
                        <p className="text-sm font-normal text-[#6B5B57] leading-[20px]">
                          {card.category}
                        </p>
                      )}
                    </div>

                    <div className="rounded-[16px] border border-[#E8CFC1] bg-[#FAEDE6] p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-[13px]">
                        <User className="h-5 w-5 text-[#781E36] shrink-0" />
                        <span className="font-medium text-[#781E36] text-sm leading-[17.5px]">
                          {card.sessionType || card.maritalStage}
                        </span>
                      </div>
                      <div className="flex items-center gap-[13px]">
                        <Building2 className="h-5 w-5 text-[#781E36] shrink-0" />
                        <span className="font-medium text-[#781E36] text-sm leading-[17.5px]">
                          {card.emirates || card.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-[13px]">
                        <MapPin className="h-5 w-5 text-[#6B5B57] shrink-0" />
                        <span className="font-medium text-[#6B5B57] text-sm leading-[17.5px]">
                          {card.language}
                        </span>
                      </div>
                    </div>

                    <div className="w-full border-t border-[#E8CFC1]" />

                    <div className="flex flex-wrap items-center gap-[8px]">
                      <Calendar className="h-5 w-5 text-[#B83A4A] shrink-0" />
                      <span className="text-sm font-medium text-[#6B5B57]">{card.date || ''}</span>
                      <Clock className="h-5 w-5 text-[#B83A4A] shrink-0 ml-4" />
                      <span className="text-sm font-medium text-[#6B5B57]">{card.startTime}{card.endTime ? ` - ${card.endTime}` : ''}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-[6px]">
                        <span className="font-normal text-[#989898] text-xl leading-[32px]">
                          {t('sessionCards.priceLabel')}
                        </span>
                        <span className="font-bold text-[#781E36] text-lg leading-[32px]">
                          {card.isFree ? 'Free' : `AED ${card.fee}`}
                        </span>
                      </div>
                      <div className="flex flex-col gap-[6px] text-end">
                        <span className="font-normal text-[#989898] text-xl leading-[32px]">
                          {t('sessionCards.durationLabel')}
                        </span>
                        <span className="font-bold text-[#781E36] text-lg leading-[32px]">
                          {card.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Link href={`/consultation/details?slug=${card.slug}`} className="w-full sm:w-[170px] h-[60px] flex items-center justify-center rounded-[50px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors">
                        {t('sessionCards.viewDetails')}
                      </Link>
                      <Link href={`/consultation/book?slug=${card.slug}`} className="w-full sm:w-[170px] h-[60px] flex items-center justify-center rounded-[50px] bg-[#781E36] px-[10px] text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors">
                        {t('sessionCards.bookNow')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          )}

          {loaded && totalPages > 1 && (
            <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} className="mt-8" />
          )}
        </div>
      </Reveal>

      {showTopics && (
      <Reveal delay={0.35} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16">
          <div className="flex flex-col items-center text-center gap-4 max-w-[1280px]">
            <h2 className="font-bold text-[#781E36] max-w-[658px] text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[48px]">
              {t('topicsTitle')}
            </h2>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">
              {t('topicsText')}
            </p>
          </div>

          <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
          >
            {topics.map((topic, i) => {
              const Icon = topicIcons[i % topicIcons.length];
              return (
                <motion.div
                  key={topic.title}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center gap-4 p-6 bg-white rounded-[16px] border border-[#E8CFC1] hover:border-[#781E36] transition-colors"
                >
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FAEDE6] border border-[#E8CFC1]">
                    <Icon className="h-7 w-7 text-[#781E36]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#781E36] leading-[24px]">{topic.title}</h3>
                  <p className="text-sm font-semibold text-[#B83A4A] leading-[20px]">
                    {topic.videos}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Reveal>
      )}

      {showContributors && (
      <Reveal delay={0.38} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 max-w-[1280px] mb-10">
            <h3 className="font-bold text-[#781E36] max-w-[658px] text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[48px]">
              {t('contributorsTitle')}
            </h3>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">
              {t('contributorsText')}
            </p>
          </div>

          {contributorList.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {contributorList.map((name, i) => {
                const Icon = contributorIcons[i % contributorIcons.length];
                return (
                  <motion.div
                    key={name}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-[#E8CFC1] hover:border-[#781E36] transition-colors"
                  >
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6] border border-[#E8CFC1]">
                      <Icon className="h-6 w-6 text-[#781E36]" />
                    </div>
                    <span className="font-semibold text-[#781E36] leading-[22px]">{name}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </Reveal>
      )}

      {showFaqs && (
      <Reveal delay={0.4} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <h2 className="font-bold text-[#781E36] text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[48px]">
              {t('faqTitle')}
            </h2>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">
              {t('faqText')}
            </p>
          </div>

          <motion.div
            className="flex flex-col gap-5 max-w-[663px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="w-full rounded-[10px] border-[0.5px] border-[#959595] bg-white p-[10px] flex flex-col gap-[10px] cursor-pointer hover:border-[#781E36] transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between w-full min-h-[30px] gap-2">
                  <span className="font-semibold text-[#781E36] text-base md:text-lg leading-[150%]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#781E36] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </div>
                {openFaq === i && (
                  <p className="text-sm font-normal text-[#6B5B57] leading-[20px] pt-2">
                    {faq.answer}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>
      )}

      {showCta && (
      <Reveal delay={0.45} direction="up">
        <div className="w-full py-[80px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div
              className="relative flex h-auto min-h-[464px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[80px] text-center text-white md:px-[80px]"
              style={{
                background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)',
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center max-w-[848px]">
                <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-[24px]">
                  {t('ctaTitle')}
                </h2>
                <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-[40px]">
                  {t('ctaText')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="#sessions"
                    className="flex h-[64px] min-w-[221px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-[32px] py-[18px] font-extrabold text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors"
                  >
                    {t('ctaBook')}
                  </Link>
                  <Link
                    href="#learn-more"
                    className="flex h-[64px] min-w-[221px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-[32px] py-[18px] font-extrabold text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors"
                  >
                    {t('ctaOrgs')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      )}
    </div>
  );
}