'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Search, Loader2, SlidersHorizontal, X, Building2, BadgeCheck, Users, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import Pagination from '@/components/shared/Pagination';
import { NEWS_IMAGES, NEWS_HERO_IMAGE } from '@/lib/image-pools';
import { getPublishedNewsPage, type PublicNews } from '@/lib/api/news';
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

interface OrgItem {
  label: string;
  subtitle: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface TopicItem {
  title: string;
  videos: string;
}

function buildNewsParams(
  q: string,
  category: string,
  source: string,
  date: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (q) params.search = q;
  if (category) params.category = category;
  if (source) params.source = source;
  if (date) params.date = date;
  return params;
}

const PER_PAGE = 6;

export default function NewsPage() {
  const t = useTranslations('news');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');

  const [articles, setArticles] = useState<PublicNews[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const presentation = usePagePresentation('news', {
    title: t('title'),
    description: t('description'),
    heroImage: NEWS_HERO_IMAGE,
    badge: t('heroBadge'),
  });

  // Section visibility — default all to true if not set (news-specific fields
  const secVis = presentation.presentation?.newsSectionVisibility ?? {};
  const showHero         = secVis.hero         !== false;
  const showCategories = secVis.categories !== false;
  const showOrgs       = secVis.orgs       !== false;
  const showTopics     = secVis.topics     !== false;
  const showContributors = secVis.contributors !== false;
  const showFaqs       = secVis.faqs       !== false;
  const showCta        = secVis.cta        !== false;

  const catOptions = t.raw('catOptions') as string[];
  const dateOptions = t.raw('dateOptions') as string[];
  const srcOptions = t.raw('sourceOptions') as string[];
  const i18nFaqs = t.raw('faqs') as FaqItem[];
  const i18nOrgs = t.raw('orgs') as OrgItem[];
  const i18nTopics = (t.raw('topics') ?? []) as TopicItem[];

  // Hybrid content resolution: CMS wins, i18n is the fallback
  const topics: TopicItem[] =
    (presentation.presentation?.newsTopics?.length &&
      presentation.presentation.newsTopics.map((topic) => ({
        title: topic.title,
        videos: topic.videos ?? '',
      }))) ||
    i18nTopics;

  const contributorList: string[] =
    (presentation.presentation?.newsContributors?.length &&
      presentation.presentation.newsContributors) ||
    [];

  const faqs: FaqItem[] =
    (presentation.presentation?.newsFaqs?.length &&
      presentation.presentation.newsFaqs.map((faq) => ({
        question: isArabic && faq.questionAr ? faq.questionAr : faq.question,
        answer: isArabic && faq.answerAr ? faq.answerAr : faq.answer,
      }))) ||
    i18nFaqs;

  const orgs = i18nOrgs.map((org, i) => ({
    ...org,
    icon: ['💒', '🏗️', '👪', '🌟'][i] ?? '🏛️',
  }));

  const categories = (t.raw('categories') as string[]).map((label, i) => ({
    icon: ['🏛️', '💍', '👨‍👩‍👧‍👦', '🤝', '📚', '🎉'][i] ?? '📰',
    label,
  }));

  const topicIcons = ['📰', '🏛️', '💍', '👨‍👩‍👧‍👦', '📚', '🎉', '🌟'];
  const contributorIcons = [Building2, BadgeCheck, Users, Globe];

  // Fetch articles from API
  useEffect(() => {
    let mounted = true;
    getPublishedNewsPage({ page: String(currentPage), perPage: String(PER_PAGE) })
      .then(({ data, meta }) => {
        if (!mounted) return;
        setArticles(data);
        setTotalPages(meta.totalPages);
      })
      .catch(() => {
        if (mounted) {
          setArticles([]);
          setTotalPages(1);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [currentPage]);

  const filters = [
    { name: 'category', label: t('category'), isDropdown: true, options: catOptions },
    { name: 'source', label: t('source'), isDropdown: true, options: srcOptions },
    { name: 'date', label: t('date'), isDropdown: true, options: dateOptions },
  ];

  const getSelectedLabel = (name: string): string | null => {
    if (name === 'category') {
      const idx = catOptions.indexOf(category);
      return idx >= 0 ? catOptions[idx] : null;
    }
    if (name === 'source') {
      const idx = srcOptions.indexOf(source);
      return idx >= 0 ? srcOptions[idx] : null;
    }
    if (name === 'date') {
      const idx = dateOptions.indexOf(date);
      return idx >= 0 ? dateOptions[idx] : null;
    }
    return null;
  };

  function handleOptionSelect(name: string, index: number) {
    setOpenDropdown(null);
    if (name === 'category') {
      const val = catOptions[index] ?? '';
      setCategory(category === val ? '' : val);
    } else if (name === 'source') {
      const val = srcOptions[index] ?? '';
      setSource(source === val ? '' : val);
    } else if (name === 'date') {
      const val = dateOptions[index] ?? '';
      setDate(date === val ? '' : val);
    }
  }

  function handleSearchWith(q: string) {
    setSearching(true);
    getPublishedNewsPage({
      ...buildNewsParams(q, category, source, date),
      page: '1',
      perPage: String(PER_PAGE),
    })
      .then(({ data, meta }) => {
        setArticles(data);
        setTotalPages(meta.totalPages);
        setCurrentPage(1);
      })
      .catch(() => { setArticles([]); setTotalPages(1); })
      .finally(() => setSearching(false));
  }

  // Search button — triggers text search only
  function handleSearch() {
    handleSearchWith(query.trim());
  }

  // Filter button — applies dropdowns only
  function handleApplyFilters() {
    setSearching(true);
    getPublishedNewsPage({
      ...buildNewsParams(query.trim(), category, source, date),
      page: '1',
      perPage: String(PER_PAGE),
    })
      .then(({ data, meta }) => {
        setArticles(data);
        setTotalPages(meta.totalPages);
        setCurrentPage(1);
      })
      .catch(() => { setArticles([]); setTotalPages(1); })
      .finally(() => setSearching(false));
  }

  function handleResetFilters() {
    setQuery('');
    setCategory('');
    setSource('');
    setDate('');
    setOpenDropdown(null);
    setCurrentPage(1);
  }

  function articleCard(article: PublicNews, i: number) {
    const coverImg = article.coverImage || NEWS_IMAGES[i % NEWS_IMAGES.length];
    const title = article.articleTitle;
    return (
      <motion.div key={article.id} variants={itemVariants}
        className="flex flex-col w-full rounded-[24px] border border-[#E8CFC1] bg-white overflow-hidden"
        style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}>
        <div className="relative w-full h-[180px] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImg})` }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(120, 30, 54, 0.8) 0%, rgba(120, 30, 54, 0.2) 50%, rgba(120, 30, 54, 0) 100%)' }} />
          {article.category && (
            <div className="absolute top-3 left-3 rounded bg-black/60 px-1.5 py-0.5">
              <span className="text-[10px] font-medium leading-[15px] text-white">{article.category}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between w-full min-h-[218px] p-6 bg-white">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-[#781E36] leading-snug">{title}</h3>
            {article.source && (
              <span className="text-[11px] font-normal text-[#989898]">{article.source}</span>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-auto">
            <hr className="border-t border-[#E8CFC1]" />
            <div className="flex items-center justify-between">
              <Link
                href={article.slug ? `/news/article?slug=${encodeURIComponent(article.slug)}` : '/news/article'}
                className="text-sm font-semibold text-[#781E36] hover:text-[#B83A4A] transition-colors"
              >
                {t('readMore')} <span className="rtl:rotate-180 inline-block">→</span>
              </Link>
              {article.publishedDate && (
                <span className="text-[11px] font-normal text-[#989898]">
                  {new Date(article.publishedDate).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('news') },
          ]} />
        </div>
      </Reveal>

      {showHero && (
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
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <Link href="#articles" className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[16px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors">
                    {t('browseArticles')}
                  </Link>
                  <Link href="#learn-more" className="flex h-[56px] w-full sm:w-[280px] items-center justify-center gap-2 rounded-[16px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors">
                    {t('learnMore')}
                  </Link>
                </div>
              </div>
              <div className="relative order-first md:order-last w-full max-w-[540px] mx-auto aspect-[4/5] max-h-[560px] rounded-[24px] overflow-hidden">
                <Image src={presentation.heroImage} alt={presentation.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 540px" priority />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#781E36]/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      )}

      {/* Search + Filter section */}
      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">

            {/* Search row — triggers text search only */}
            <div className="flex items-center gap-[10px] w-full">
              <div className="flex items-center gap-[10px] flex-1 h-[48px] sm:h-[56px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
                <Search className="h-5 w-5 text-[#989898] shrink-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); handleSearchWith(''); }} className="shrink-0 text-[#989898] hover:text-[#781E36] cursor-pointer" aria-label="Clear search">
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

            {/* Filter row — dropdowns + Apply Filters button */}
            <div className="flex flex-col sm:flex-row gap-[10px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] flex-1">
                {filters.map((filter) => {
                  const selected = getSelectedLabel(filter.name);
                  const active = Boolean(selected);
                  return (
                    <div key={filter.name} className="relative w-full">
                      <button type="button"
                        onClick={() => setOpenDropdown(openDropdown === filter.name ? null : filter.name)}
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

      {/* All Articles — single unified paginated grid */}
      <Reveal delay={0.25} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16" id="articles">
          {loading || searching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm font-normal text-[#6B5B57]">No articles found matching your search or filters.</p>
              <button type="button" onClick={handleResetFilters}
                className="h-[48px] rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors">
                {t('reset')}
              </button>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-50px' }}
              >
                {articles.map((article, i) => articleCard(article, i))}
              </motion.div>
              {totalPages >= 1 && (
                <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} className="mt-8" />
              )}
            </>
          )}
        </div>
      </Reveal>

      {showCategories && (
      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">{t('popularCategories')}</span>
              <p className="text-sm font-normal text-[#6B5B57]">{t('popularCategoriesText')}</p>
            </div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {categories.map((cat, i) => (
                <motion.div key={i} variants={itemVariants}
                  className="flex flex-col items-center justify-center gap-3 w-full h-[184px] rounded-[24px] bg-white cursor-pointer hover:border-[#781E36] transition-all"
                  style={{ boxShadow: '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' }}>
                  <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[16px] bg-[#FAEDE6]">
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <span className="text-center max-w-[120px] text-sm font-extrabold text-[#781E36] leading-snug">{cat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>
      )}

      {showTopics && topics.length > 0 && (
      <Reveal delay={0.32} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white py-12 px-8 rounded-none border-b border-[#E8CFC1]">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">{t('exploreTopics') || 'Explore Topics'}</span>
              <p className="text-sm font-normal text-[#6B5B57]">{t('exploreTopicsText') || 'Browse our curated collection of news categories and featured topics.'}</p>
            </div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {topics.map((topic, i) => (
                <motion.div key={i} variants={itemVariants}
                  className="flex flex-col gap-4 w-full rounded-[24px] border border-[#E8CFC1] bg-white p-6 cursor-pointer hover:border-[#781E36] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-[14px] bg-[#FAEDE6]">
                      <span className="text-xl">{topicIcons[i % topicIcons.length]}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-base font-bold text-[#781E36] leading-snug">{topic.title}</h3>
                      <span className="text-xs font-semibold text-[#987171]">{topic.videos}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>
      )}

      {showOrgs && (
      <Reveal delay={0.35} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12" id="learn-more">
          <div className="flex flex-col gap-8 w-full bg-white pt-[48px] pb-[48px] px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">{t('featuredOrgs')}</span>
              <p className="text-sm font-normal text-[#6B5B57]">{t('featuredOrgsText')}</p>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {orgs.map((org, i) => (
                <motion.div key={i} variants={itemVariants}
                  className="flex flex-col items-center justify-center gap-3 w-full min-h-[200px] rounded-[24px] bg-white border border-[#E8CFC1] cursor-pointer hover:border-[#781E36] transition-all px-6 py-8"
                  style={{ boxShadow: '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' }}>
                  <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[16px] bg-[#FAEDE6]">
                    <span className="text-2xl">{org.icon}</span>
                  </div>
                  <span className="text-center text-sm font-extrabold text-[#781E36] leading-snug">{org.label}</span>
                  <span className="text-center text-xs font-normal text-[#6B5B57]">{org.subtitle}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>
      )}

      {showContributors && contributorList.length > 0 && (
      <Reveal delay={0.38} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white py-12 px-8 rounded-none border-b border-[#E8CFC1]">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">{t('trustedContributors') || 'Trusted Contributors'}</span>
              <p className="text-sm font-normal text-[#6B5B57]">{t('trustedContributorsText') || 'Content provided by our trusted partners and organizations.'}</p>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {contributorList.map((name, i) => {
                const Icon = contributorIcons[i % contributorIcons.length];
                return (
                  <motion.div key={i} variants={itemVariants}
                    className="flex items-center gap-3 w-full h-[88px] rounded-[20px] bg-white border border-[#E8CFC1] px-5 cursor-pointer hover:border-[#781E36] hover:shadow-md transition-all">
                    <div className="flex items-center justify-center h-11 w-11 rounded-[12px] bg-[#FAEDE6] shrink-0">
                      <Icon className="h-5 w-5 text-[#781E36]" />
                    </div>
                    <span className="text-sm font-bold text-[#781E36] leading-snug truncate">{name}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </Reveal>
      )}

      {showFaqs && (
      <Reveal delay={0.4} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#781E36] leading-tight">{t('faqTitle')}</h2>
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
                <div className="flex items-center justify-between w-full h-[30px]">
                  <span className="text-lg sm:text-xl font-semibold text-[#781E36] leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#781E36] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && <p className="text-sm font-normal text-[#6B5B57] leading-[20px] pt-2">{faq.answer}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>
      )}

      {showCta && (
      <Reveal delay={0.45} direction="up">
        <div className="w-full pb-[80px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="relative flex h-auto min-h-[464px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[80px] text-center text-white md:px-[80px]"
              style={{ background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center max-w-[848px]">
                <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-[24px]">{t('ctaTitle')}</h2>
                <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-[40px]">{t('ctaText')}</p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/initiatives" className="flex h-[64px] w-full sm:w-auto min-w-[221px] items-center justify-center gap-2 rounded-full bg-white px-[32px] py-[18px] font-extrabold text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors">{t('ctaExplore')}</Link>
                  <Link href="/consultation" className="flex h-[64px] w-full sm:w-auto min-w-[221px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-[32px] py-[18px] font-extrabold text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors">{t('ctaConsultation')}</Link>
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
