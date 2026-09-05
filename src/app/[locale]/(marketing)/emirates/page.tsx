'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Search, ChevronDown, Building2, MapPin, Users, BadgeCheck, Globe, HelpCircle, BookOpen, Loader2, SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { getPublishedEmirates, type PublicEmirate } from '@/lib/api/emirates';
import { EMIRATES_IMAGES, EMIRATES_HERO_IMAGE } from '@/lib/image-pools';
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

interface Topic {
  title: string;
  videos: string;
}
interface Faq {
  question: string;
  answer: string;
}

interface DisplayItem {
  slug: string;
  image: string;
  name: string;
  description: string;
  count: string;
}

const fallbackImages = EMIRATES_IMAGES;

export default function EmiratesPage() {
  const t = useTranslations('emiratesPage');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [searchText, setSearchText] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searching, setSearching] = useState(false);

  const presentation = usePagePresentation('emirates', {
    title: t('title'),
    description: t('description'),
    heroImage: EMIRATES_HERO_IMAGE,
  });

  // Build date options from i18n
  const dateOptions = t.raw('dateOptions') as string[];
  const regionOptions = useMemo(() => items.map((item) => item.name), [items]);

  function mapDate(label: string): string {
    const mapping: Record<string, string> = {};
    const rawOptions = dateOptions;
    if (rawOptions?.[0]) mapping[rawOptions[0]] = 'week';
    if (rawOptions?.[1]) mapping[rawOptions[1]] = 'month';
    if (rawOptions?.[2]) mapping[rawOptions[2]] = 'year';
    return mapping[label] ?? label;
  }

  function fetchEmirates(q = searchText, d = filterDate, r = filterRegion) {
    const params: Record<string, string> = {};
    if (q.trim()) params.search = q.trim();
    if (d) params.date = mapDate(d);
    return getPublishedEmirates(params).then((list: PublicEmirate[]) => {
      if (!list.length) return [];
      const display: DisplayItem[] = list.map((emi, i) => ({
        slug: emi.slug,
        image: emi.image || fallbackImages[i % fallbackImages.length],
        name: (isArabic && (emi as any).emiratesNameAr ? (emi as any).emiratesNameAr : '') || emi.title || emi.emiratesName,
        description: emi.description || '',
        count: emi.centerCount || '',
      }));
      return r ? display.filter((item) => item.name === r) : display;
    });
  }

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    fetchEmirates(searchText, filterDate, filterRegion)
      .then((display) => {
        if (!cancelled) {
          setItems(display);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setLoaded(true);
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  function handleSearchWith(q: string) {
    setSearching(true);
    fetchEmirates(q, filterDate, filterRegion)
      .then((display) => setItems(display))
      .catch(() => setItems([]))
      .finally(() => setSearching(false));
  }

  function handleSearch() {
    handleSearchWith(searchText.trim());
  }

  function handleApplyFilters() {
    setSearching(true);
    fetchEmirates(searchText, filterDate, filterRegion)
      .then((display) => setItems(display))
      .catch(() => setItems([]))
      .finally(() => setSearching(false));
  }

  function handleResetFilters() {
    setSearchText('');
    setFilterRegion('');
    setFilterDate('');
    setOpenDropdown(null);
    setSearching(true);
    fetchEmirates('', '', '')
      .then((display) => setItems(display))
      .catch(() => setItems([]))
      .finally(() => setSearching(false));
  }

  // Hybrid content resolution: CMS wins, i18n is the fallback.
  const i18nTopics = (t.raw('topics') ?? []) as Topic[];
  const i18nFaqs = (t.raw('faqs') ?? []) as Faq[];
  const i18nOrgs = (t.raw('orgs') ?? []) as Array<{ label: string; subtitle: string }>;

  const topics: Topic[] =
    (presentation.presentation?.emiratesTopics?.length &&
      presentation.presentation.emiratesTopics.map((topic) => ({
        title: (isArabic && topic.titleAr ? topic.titleAr : topic.title) || topic.title,
        videos: topic.videos ?? '',
      }))) ||
    i18nTopics;
  const contributorList: string[] =
    (presentation.presentation?.emiratesContributors?.length &&
      presentation.presentation.emiratesContributors) ||
    [];
  const faqs: Faq[] =
    (presentation.presentation?.emiratesFaqs?.length &&
      presentation.presentation.emiratesFaqs.map((faq) => ({
        question: isArabic && faq.questionAr ? faq.questionAr : faq.question,
        answer: isArabic && faq.answerAr ? faq.answerAr : faq.answer,
      }))) ||
    i18nFaqs;

  // Section visibility — default all to true if not set
  const secVis = presentation.presentation?.emiratesSectionVisibility ?? {};
  const showHero = secVis.hero !== false;
  const showTopics = secVis.topics !== false;
  const showContributors = secVis.contributors !== false;
  const showFaqs = secVis.faqs !== false;
  const showCta = secVis.cta !== false;

  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const topicIcons = [MapPin, Building2, BookOpen, HelpCircle, BadgeCheck, Users, Globe];
  const contributorIcons = [Building2, BadgeCheck, Users, Globe];
  const orgIcons = ['💒', '🏗️', '👪', '🌟'];

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('emirates') },
          ]} />
        </div>
      </Reveal>

      {showHero && (
      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex flex-col gap-8 max-w-[672px] w-full">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[48px] leading-snug md:leading-[67px]">
                  {presentation.title}
                </h1>
                <p className="font-normal text-[#6B5B57] text-base sm:text-lg md:text-[20px] md:leading-[34px]">
                  {presentation.description}
                </p>
              </div>

              <div className="w-full max-w-[640px]">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
                  <Image
                    src={presentation.heroImage}
                    alt={presentation.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#781E36]/15 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      )}

      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">
                {t('exploreTitle')}
              </span>
              <p className="text-sm text-[#6B5B57]">
                {t('exploreText')}
              </p>
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                      className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${
                        filterRegion || openDropdown === 'region'
                          ? 'border-[#781E36]'
                          : 'border-[#E8CFC1] hover:border-[#781E36]'
                      }`}
                    >
                      <span className={`text-sm truncate ${filterRegion ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                        {filterRegion || 'All Emirates'}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${openDropdown === 'region' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === 'region' && (
                      <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => { setFilterRegion(''); setOpenDropdown(null); }}
                          className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                        >
                          All Emirates
                        </button>
                        {regionOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setFilterRegion(opt); setOpenDropdown(null); }}
                            className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                      className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${
                        filterDate || openDropdown === 'date'
                          ? 'border-[#781E36]'
                          : 'border-[#E8CFC1] hover:border-[#781E36]'
                      }`}
                    >
                      <span className={`text-sm truncate ${filterDate ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                        {filterDate || t('dateLabel')}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${openDropdown === 'date' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === 'date' && (
                      <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => { setFilterDate(''); setOpenDropdown(null); }}
                          className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                        >
                          {t('anyDate')}
                        </button>
                        {dateOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setFilterDate(opt); setOpenDropdown(null); }}
                            className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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

            {!loaded ? (
              <p className="text-center text-base font-normal text-[#6B5B57] py-10">Loading...</p>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-base font-normal text-[#6B5B57]">No emirates found.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-[52px] rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-50px' }}
              >
                {items.map((item) => (
                  <motion.div key={item.slug} variants={itemVariants} className="flex flex-col mx-auto w-full max-w-[400px] min-h-[370px] rounded-[24px] border border-[#E8CFC1] bg-white overflow-hidden">
                    <div className="relative w-full h-[160px] shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" unoptimized />
                    </div>
                    <div className="flex flex-col flex-1 p-4 gap-3">
                      <span className="text-sm font-bold text-[#781E36]">
                        {item.name}
                      </span>
                      <p className="text-xs leading-4 text-[#6B5B57]">
                        {item.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#E8CFC1]">
                        <span className="rounded-full bg-[#781E36] px-3 py-0.5 text-xs font-bold text-white">
                          {item.count}
                        </span>
                        <Link href={`/emirates/${item.slug}`} className="flex items-center gap-1 text-xs font-bold text-[#781E36] hover:text-[#B83A4A] transition-colors">
                          {t('readMore')}
                          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>

      {showTopics && (
      <Reveal delay={0.25} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16">
          <div className="flex flex-col items-center text-center gap-4 max-w-[1280px] mb-10">
            <h3 className="font-bold text-[#781E36] max-w-[658px] text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[48px]">
              {t('topicsTitle')}
            </h3>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">
              {t('topicsText')}
            </p>
          </div>

          {topics.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
          )}
        </div>
      </Reveal>
      )}

      {showContributors && (
      <Reveal delay={0.28} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-8 w-full bg-white pt-[48px] pb-[48px] px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">
                {t('contributorsTitle')}
              </span>
              <p className="text-sm text-[#6B5B57]">
                {t('contributorsText')}
              </p>
            </div>

            {contributorList.length > 0 ? (
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
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-50px' }}
              >
                {i18nOrgs.map((org, i) => {
                  const isSelected = selectedOrg === org.label;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className={`flex flex-col items-center justify-center gap-3 w-full min-h-[200px] rounded-[24px] bg-white cursor-pointer transition-all px-6 py-8 ${isSelected ? 'border-2 border-[#781E36]' : 'border border-[#E8CFC1]'}`}
                      style={{
                        boxShadow: isSelected ? '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' : 'none',
                      }}
                      onClick={() => setSelectedOrg(isSelected ? null : org.label)}
                    >
                      <div className={`flex items-center justify-center h-[56px] w-[56px] rounded-[16px] transition-colors ${isSelected ? 'bg-[#781E36]' : 'bg-[#FAEDE6]'}`}>
                        <span className="text-2xl">{orgIcons[i % orgIcons.length]}</span>
                      </div>
                      <span className="text-center text-sm font-extrabold leading-[19.25px] text-[#781E36]">{org.label}</span>
                      <span className="text-center text-xs text-[#6B5B57]">{org.subtitle}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>
      )}

      {showFaqs && (
      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <h2 className="font-bold text-[#781E36] text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[48px]">
              {t('faqTitle')}
            </h2>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">
              {t('faqText')}
            </p>
          </div>

          {faqs.length > 0 && (
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
          )}
        </div>
      </Reveal>
      )}

      {showCta && (
      <Reveal delay={0.35} direction="up">
        <div className="w-full pb-[80px]">
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
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="/initiatives" className="flex h-[56px] sm:h-[64px] w-full sm:w-auto sm:min-w-[221px] items-center justify-center gap-2 rounded-full bg-white px-8 font-extrabold text-base sm:text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors">
                    {t('ctaExplore')}
                  </Link>
                  <Link href="/consultation" className="flex h-[56px] sm:h-[64px] w-full sm:w-auto sm:min-w-[221px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 font-extrabold text-base sm:text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors">
                    {t('ctaConsultation')}
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
