'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import Pagination from '@/components/shared/Pagination';
import { SHORT_IMAGES, SHORTS_HERO_IMAGE } from '@/lib/image-pools';
import { getPublishedShorts, getPublishedShortsPage, type PublicShort } from '@/lib/api/shorts';
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

function buildShortParams(
  q: string,
  marital: string,
  language: string,
  date: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (q) params.search = q;
  if (marital) params.marital_stage = marital;
  if (language) params.language = language;
  if (date) params.date = date;
  return params;
}

interface Topic {
  title: string;
  videos: string;
}

interface Faq {
  question: string;
  answer: string;
}

const LIBRARY_PER_PAGE = 8;

export default function ShortsPage() {
  const t = useTranslations('shorts');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [marital, setMarital] = useState('');
  const [language, setLanguage] = useState('');
  const [date, setDate] = useState('');
  const [featured, setFeatured] = useState<PublicShort[]>([]);
  const [videos, setVideos] = useState<PublicShort[]>([]);
  const [libraryPage, setLibraryPage] = useState(1);
  const [libraryTotalPages, setLibraryTotalPages] = useState(1);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Featured carousel scroll state
  const featuredRef = useRef<HTMLDivElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const presentation = usePagePresentation('shorts', {
    title: t('title'),
    description: t('description'),
    heroImage: SHORTS_HERO_IMAGE,
  });

  useEffect(() => {
    let mounted = true;
    getPublishedShorts()
      .then((items) => {
        if (!mounted) return;
        setFeatured(items.filter((v) => v.category).slice(0, 6));
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoadingFeatured(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    getPublishedShortsPage({ page: String(libraryPage), perPage: String(LIBRARY_PER_PAGE) })
      .then(({ data, meta }) => {
        if (!mounted) return;
        setVideos(data);
        setLibraryTotalPages(meta.totalPages);
      })
      .catch(() => {
        if (mounted) {
          setVideos([]);
          setLibraryTotalPages(1);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [libraryPage]);

  function scrollFeatured(dir: 1 | -1) {
    const el = featuredRef.current;
    if (!el) return;
    const first = el.querySelector(':scope > *') as HTMLElement | null;
    const step = (first?.getBoundingClientRect().width ?? 280) + 24;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  function onFeaturedScroll() {
    const el = featuredRef.current;
    if (!el) return;
    const first = el.querySelector(':scope > *') as HTMLElement | null;
    const step = (first?.getBoundingClientRect().width ?? 280) + 24;
    if (step <= 0) return;
    setFeaturedIndex(Math.round(el.scrollLeft / step));
  }

  const topics = t.raw('topics') as Topic[];
  const contributorList = t.raw('contributorList') as string[];
  const faqs = t.raw('faqs') as Faq[];
  const maritalOptions = t.raw('maritalOptions') as string[];
  const languageOptions = t.raw('languageOptions') as string[];
  const dateOptions = t.raw('dateOptions') as string[];

  const isArabic = locale === 'ar';
  const getTitle = (v: PublicShort) =>
    isArabic && v.videoTitleAr ? v.videoTitleAr : v.videoTitle;

  const filters = [
    { name: 'marital', label: t('marital'), isDropdown: true, options: maritalOptions },
    { name: 'language', label: t('language'), isDropdown: true, options: languageOptions },
    { name: 'date', label: t('date'), isDropdown: true, options: dateOptions },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const MARITAL_VALUES = ['premarital', 'marital', 'postMarital'];
  const LANGUAGE_VALUES = ['ar', 'en', 'both'];
  const DATE_VALUES = ['week', 'month', 'year'];

  function handleOptionSelect(name: string, index: number) {
    setOpenDropdown(null);
    if (name === 'marital') {
      const val = MARITAL_VALUES[index] ?? '';
      setMarital(marital === val ? '' : val);
    } else if (name === 'language') {
      const val = LANGUAGE_VALUES[index] ?? '';
      setLanguage(language === val ? '' : val);
    } else if (name === 'date') {
      const val = DATE_VALUES[index] ?? '';
      setDate(date === val ? '' : val);
    }
  }

  function getSelectedLabel(filter: (typeof filters)[number]): string | null {
    if (filter.name === 'marital') {
      const idx = MARITAL_VALUES.indexOf(marital);
      return idx >= 0 ? maritalOptions[idx] : null;
    }
    if (filter.name === 'language') {
      const idx = LANGUAGE_VALUES.indexOf(language);
      return idx >= 0 ? languageOptions[idx] : null;
    }
    if (filter.name === 'date') {
      const idx = DATE_VALUES.indexOf(date);
      return idx >= 0 ? dateOptions[idx] : null;
    }
    return null;
  }

  function handleResetFilters() {
    setQuery('');
    setMarital('');
    setLanguage('');
    setDate('');
    setOpenDropdown(null);
    setLibraryPage(1);
  }

  function handleApplyFilters() {
    const q = query.trim();
    if (!q && !marital && !language && !date) {
      setLibraryPage(1);
      return;
    }
    setSearching(true);
    getPublishedShortsPage({
      ...buildShortParams(q, marital, language, date),
      page: '1',
      perPage: String(LIBRARY_PER_PAGE),
    })
      .then(({ data, meta }) => {
        setVideos(data);
        setLibraryTotalPages(meta.totalPages);
        setLibraryPage(1);
      })
      .catch(() => {
        setVideos([]);
        setLibraryTotalPages(1);
      })
      .finally(() => setSearching(false));
  }

  function videoCard(video: PublicShort, i: number, key: string) {
    const coverImg = video.coverImage || SHORT_IMAGES[i % SHORT_IMAGES.length];
    return (
      <motion.div key={key} variants={itemVariants}
        className="flex flex-col w-full rounded-[20px] border border-[#E8CFC1] bg-white overflow-hidden"
        style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}>
        <Link href={`/shorts/${video.slug}`}>
          <div className="relative w-full aspect-video bg-[#E8CFC1] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImg})` }} />
            <div className="absolute top-3 right-3 rounded bg-black/60 px-1.5 py-0.5">
              <span className="text-[10px] font-medium leading-[15px] text-white">{video.duration}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M15.5 8.5L0.5 0.5V17.5L15.5 8.5Z" fill="#781E36" /></svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-4 gap-3 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#989898]">{video.category || 'Video'}</span>
            <span className="text-[15px] font-bold leading-5 text-[#781E36]">{getTitle(video)}</span>
            <div className="flex items-center gap-3 mt-auto">
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#989898"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span className="text-[11px] font-normal text-[#989898]">{video.views || 0}</span>
              </div>
              <span className="text-[11px] font-normal text-[#989898]">
                {video.publishedAt
                  ? new Date(video.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('shorts') },
          ]} />
        </div>
      </Reveal>

      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#781E36] leading-tight">
                  {presentation.title}
                </h1>
                <p className="text-base md:text-lg font-normal text-[#6B5B57] leading-relaxed">
                  {presentation.description}
                </p>
              </div>
              <div className="relative order-first md:order-last w-full max-w-[540px] mx-auto aspect-[4/5] max-h-[560px] rounded-[24px] overflow-hidden">
                <Image src={presentation.heroImage} alt={presentation.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 540px" priority />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#781E36]/25 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px] w-full h-[48px] sm:h-[61px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
              <Search className="h-5 w-5 text-[#989898] shrink-0" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {filters.map((filter) => {
                const selected = getSelectedLabel(filter);
                const active = Boolean(selected);
                return (
                  <div key={filter.name} className="relative w-full">
                    <button type="button"
                      onClick={() => toggleDropdown(filter.name)}
                      className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${active || openDropdown === filter.name ? 'border-[#781E36]' : 'border-[#E8CFC1] hover:border-[#781E36]'}`}>
                      <span className={`text-sm truncate ${active ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                        {selected || filter.label}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${openDropdown === filter.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === filter.name && (
                      <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                        {filter.options.map((opt, index) => (
                          <button key={opt} type="button" onClick={() => handleOptionSelect(filter.name, index)}
                            className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors">{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-[10px] w-full">
              <button className="w-full h-[52px] rounded-[12px] bg-[#781E36] px-6 py-3 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors sm:flex-1" onClick={handleApplyFilters}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t('filterButton')}
              </button>
              <button className="w-full sm:w-auto h-[52px] rounded-[12px] bg-[#FAEDE6] px-6 py-3 text-sm font-bold text-[#781E36] border border-[#E8CFC1] hover:bg-[#F3D9CE] transition-colors" onClick={handleResetFilters}>{t('resetFilters')}</button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Featured Shorts — sideways scrollable carousel with pagination */}
      <Reveal delay={0.25} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-[44px] w-full">
            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-xl font-bold leading-7 text-[#781E36]">{t('featuredTitle')}</span>
                <span className="text-sm font-normal text-[#6B5B57]">{t('featuredSubtitle')}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button type="button" aria-label="Previous featured shorts" onClick={() => scrollFeatured(-1)}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E8CFC1] bg-white text-[#781E36] transition-colors hover:bg-[#781E36] hover:text-white">
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
                <button type="button" aria-label="Next featured shorts" onClick={() => scrollFeatured(1)}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E8CFC1] bg-white text-[#781E36] transition-colors hover:bg-[#781E36] hover:text-white">
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            {loadingFeatured ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
              </div>
            ) : featured.length === 0 ? (
              <p className="text-sm font-normal text-[#6B5B57]">{t('empty')}</p>
            ) : (
              <>
                <motion.div
                  ref={featuredRef}
                  onScroll={onFeaturedScroll}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-50px' }}
                >
                  {featured.map((video, i) => (
                    <div key={`featured-${video.id}`} className="snap-start shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-16px)]">
                      <motion.div variants={itemVariants} className="flex flex-col w-full rounded-[20px] border border-[#E8CFC1] bg-white overflow-hidden" style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}>
                        <Link href={`/shorts/${video.slug}`}>
                          <div className="relative w-full aspect-video bg-[#E8CFC1] overflow-hidden">
                            <Image src={video.coverImage || SHORT_IMAGES[i % SHORT_IMAGES.length]} alt={getTitle(video)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 320px" />
                            <div className="absolute top-3 right-3 rounded bg-black/60 px-1.5 py-0.5">
                              <span className="text-[10px] font-medium leading-[15px] text-white">{video.duration}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M15.5 8.5L0.5 0.5V17.5L15.5 8.5Z" fill="#781E36" /></svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col p-4 gap-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#989898]">{video.category}</span>
                            <span className="text-[15px] font-bold leading-5 text-[#781E36]">{getTitle(video)}</span>
                            <div className="flex items-center gap-3 mt-auto">
                              <span className="text-[11px] font-normal text-[#989898]">{video.views || 0} views</span>
                              <span className="text-[11px] font-normal text-[#989898]">
                                {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>

                {featured.length > 4 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to featured short ${i + 1}`}
                        onClick={() => {
                          const el = featuredRef.current;
                          if (!el) return;
                          const first = el.querySelector(':scope > *') as HTMLElement | null;
                          const step = (first?.getBoundingClientRect().width ?? 280) + 24;
                          el.scrollTo({ left: i * step, behavior: 'smooth' });
                        }}
                        className={`h-2 rounded-full transition-all ${featuredIndex === i ? 'w-6 bg-[#781E36]' : 'w-2 bg-[#E8CFC1] hover:bg-[#B83A4A]'}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Reveal>

      {/* Video Shorts Library — paginated grid */}
      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-[44px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <span className="text-xl font-bold leading-7 text-[#781E36]">{t('libraryTitle')}</span>
              <span className="text-sm font-normal text-[#6B5B57]">{t('librarySubtitle')}</span>
            </div>
            {loading || searching ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
              </div>
            ) : videos.length === 0 ? (
              <p className="text-sm font-normal text-[#6B5B57]">{t('empty')}</p>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-50px' }}
              >
                {videos.map((video, i) => videoCard(video, i, `library-${video.id}`))}
              </motion.div>
            )}
            {!loading && !searching && libraryTotalPages > 1 && (
              <Pagination page={libraryPage} totalPages={libraryTotalPages} onChange={setLibraryPage} className="mt-4" />
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.35} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-6 w-full bg-white border-t border-b border-[#E8CFC1] py-8 px-4 sm:px-8">
            <div className="flex flex-col gap-[6px] px-4">
              <span className="text-xl font-bold leading-7 text-[#781E36]">{t('exploreTopics')}</span>
              <span className="text-sm font-normal text-[#6B5B57]">{t('exploreTopicsText')}</span>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {topics.map((topic, i) => (
                <motion.div key={i} variants={itemVariants}
                  className="flex flex-col items-center gap-3 w-full h-auto min-h-[125px] rounded-[16px] border border-[#E8CFC1] bg-white p-4 cursor-pointer hover:border-[#781E36] transition-colors">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FAEDE6]">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none"><path d="M9 0L11.59 5.41L17 6.18L13 10.64L14.18 16L9 13.77L3.82 16L5 10.64L1 6.18L6.41 5.41L9 0Z" fill="#781E36" /></svg>
                  </div>
                  <span className="text-center text-base font-semibold leading-4 text-[#781E36]">{topic.title}</span>
                  <span className="text-center text-base font-normal leading-[15px] text-[#6B5B57]">{topic.videos}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.4} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-6 w-full bg-white pt-[30px] pb-[48px] px-4 sm:px-8">
            <span className="text-xl font-bold leading-7 text-[#781E36]">{t('contributors')}</span>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {contributorList.map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="flex items-center gap-[12px] w-full h-auto min-h-[74px] rounded-[16px] border border-[#E8CFC1] bg-white p-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="#781E36" strokeWidth="1.5" /><path d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18" stroke="#781E36" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                  <span className="text-base font-semibold leading-[15px] text-[#781E36]">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.45} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-[#781E36] leading-tight">{t('faqTitle')}</h2>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">{t('faqText')}</p>
          </div>
          <motion.div
            className="flex flex-col gap-5 max-w-[663px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={itemVariants}
                className="w-full rounded-[10px] border-[0.5px] border-[#959595] bg-white p-[10px] flex flex-col gap-[10px] cursor-pointer hover:border-[#781E36] transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between w-full h-auto min-h-[30px] gap-3">
                  <span className="text-base md:text-lg font-semibold text-[#781E36] leading-[150%]">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#781E36] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && <p className="text-sm font-normal text-[#6B5B57] leading-5 pt-2">{faq.answer}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>

      <Reveal delay={0.5} direction="up">
        <div className="w-full pb-[80px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="relative flex h-auto min-h-[464px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[80px] text-center text-white md:px-[80px]"
              style={{ background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center max-w-[848px]">
                <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-6">{t('ctaTitle')}</h2>
                <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-10">{t('ctaText')}</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="#videos" className="flex h-[64px] w-full sm:w-[221px] items-center justify-center gap-2 rounded-full bg-white px-8 py-[18px] font-extrabold text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors">{t('ctaBrowse')}</Link>
                  <Link href="/initiatives" className="flex h-[64px] w-full sm:w-[221px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-[18px] font-extrabold text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors">{t('ctaExplore')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
