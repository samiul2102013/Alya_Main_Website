'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2, Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Button from '@/components/shared/Button';
import Reveal from '@/components/shared/Reveal';
import Pagination from '@/components/shared/Pagination';
import { Link } from '@/i18n/navigation';
import {
  getPublishedInitiativesPage,
  type PublicInitiative,
} from '@/lib/api/initiatives';
import { EMIRATES_OPTIONS } from '@/lib/constants';
import { usePagePresentation } from '@/hooks/usePagePresentation';

const PER_PAGE = 9;

interface Topic {
  title: string;
  videos: string;
}

interface Faq {
  question: string;
  answer: string;
}

export default function InitiativesPage() {
  const t = useTranslations('initiative');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [items, setItems] = useState<PublicInitiative[]>([]);
  const [meta, setMeta] = useState({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState('');
  const [emirate, setEmirate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<'emirate' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const INITIATIVES_HERO_IMAGE = 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=1200&auto=format&fit=crop';

  const presentation = usePagePresentation('initiatives', {
    title: t('browseInitiatives'),
    description: t('description'),
    heroImage: INITIATIVES_HERO_IMAGE,
  });

  function buildParams(q = query, em = emirate, p = page) {
    const params: Record<string, string> = { page: String(p), perPage: String(PER_PAGE), listed: '1' };
    if (q.trim()) params.search = q.trim();
    if (em) params.emirate = em;
    return params;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPublishedInitiativesPage(buildParams(query, emirate, page))
      .then(({ data, meta: m }) => {
        if (!mounted) return;
        setItems(data);
        setMeta(m);
      })
      .catch(() => {
        if (mounted) {
          setItems([]);
          setMeta({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchWith(q: string) {
    setSearching(true);
    getPublishedInitiativesPage(buildParams(q, emirate, 1))
      .then(({ data, meta: m }) => {
        setItems(data);
        setMeta(m);
        setPage(1);
      })
      .catch(() => {
        setItems([]);
        setMeta({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 });
      })
      .finally(() => setSearching(false));
  }

  function handleSearch() {
    handleSearchWith(query.trim());
  }

  function handleApplyFilters() {
    setSearching(true);
    getPublishedInitiativesPage(buildParams(query, emirate, 1))
      .then(({ data, meta: m }) => {
        setItems(data);
        setMeta(m);
        setPage(1);
      })
      .catch(() => {
        setItems([]);
        setMeta({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 });
      })
      .finally(() => setSearching(false));
  }

  function handleReset() {
    setQuery('');
    setEmirate('');
    setDropdownOpen(null);
    setPage(1);
    setLoading(true);
    getPublishedInitiativesPage({ page: '1', perPage: String(PER_PAGE), listed: '1' })
      .then(({ data, meta: m }) => {
        setItems(data);
        setMeta(m);
      })
      .finally(() => setLoading(false));
  }

  const titleByValue = useMemo(() => {
    const map = new Map<string, string>();
    EMIRATES_OPTIONS.forEach((e) => map.set(e.value, e.label));
    return map;
  }, []);

  function getTitle(item: PublicInitiative): string {
    if (isArabic && item.titleAr) return item.titleAr;
    return item.title;
  }
  function getSubtitle(item: PublicInitiative): string {
    if (isArabic && item.subtitleAr) return item.subtitleAr;
    return item.subtitle ?? '';
  }

  // Hybrid content resolution: CMS wins, i18n is the fallback.
  const rawTopics = t.raw('topics');
  const rawFaqs = t.raw('faqs');
  const i18nTopics = (Array.isArray(rawTopics) ? rawTopics : []) as Topic[];
  const i18nFaqs = (Array.isArray(rawFaqs) ? rawFaqs : []) as Faq[];

  const topics: Topic[] =
    (presentation.presentation?.initiativesTopics?.length
      ? presentation.presentation.initiativesTopics.map((topic) => ({
          title: topic.title,
          videos: topic.videos ?? '',
        }))
      : i18nTopics) || [];
  const contributorList: string[] =
    (presentation.presentation?.initiativesContributors?.length
      ? presentation.presentation.initiativesContributors
      : []) || [];
  const faqs: Faq[] =
    (presentation.presentation?.initiativesFaqs?.length
      ? presentation.presentation.initiativesFaqs.map((faq) => ({
          question: isArabic && faq.questionAr ? faq.questionAr : faq.question,
          answer: isArabic && faq.answerAr ? faq.answerAr : faq.answer,
        }))
      : i18nFaqs) || [];

  // Section visibility — default all to true if not set
  const secVis = presentation.presentation?.initiativesSectionVisibility ?? {};
  const showHero = secVis.hero !== false;
  const showTopics = secVis.topics !== false;
  const showContributors = secVis.contributors !== false;
  const showFaqs = secVis.faqs !== false;
  const showCta = secVis.cta !== false;

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb
            items={[
              { label: nav('home'), href: '/' },
              { label: t('browseInitiatives') },
            ]}
          />
        </div>
      </Reveal>

      {showHero && (
      <Reveal delay={0.05} direction="up">
        <section className="w-full bg-white mb-10">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[44px] leading-tight">
                  {presentation.title}
                </h1>
                <p className="text-base sm:text-lg text-[#6B5B57] leading-relaxed">
                  {presentation.description}
                </p>
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
                <div className="absolute inset-0 bg-gradient-to-tl from-[#781E36]/25 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      )}

      <Reveal delay={0.1} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">
            {/* ROW 1: Search input + Search button */}
            <div className="flex items-center gap-[10px] w-full">
              <div className="flex items-center gap-[10px] flex-1 h-[48px] sm:h-[56px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
                <Search className="h-5 w-5 text-[#989898] shrink-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') ?? 'Search initiatives...'}
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
                <span className="hidden sm:inline">{t('search') ?? 'Search'}</span>
              </button>
            </div>

            {/* ROW 2: Emirate dropdown + Filter button + Reset button */}
            <div className="flex flex-col sm:flex-row gap-[10px] w-full">
              <div className="flex-1 relative w-full">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === 'emirate' ? null : 'emirate')}
                  className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${
                    emirate || dropdownOpen === 'emirate'
                      ? 'border-[#781E36]'
                      : 'border-[#E8CFC1] hover:border-[#781E36]'
                  }`}
                >
                  <span className={`text-sm truncate ${emirate ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                    {emirate ? (titleByValue.get(emirate) ?? emirate) : (t('allEmirates') ?? 'All Emirates')}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${dropdownOpen === 'emirate' ? 'rotate-180' : ''}`}
                  />
                </button>
                {dropdownOpen === 'emirate' && (
                  <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => { setEmirate(''); setDropdownOpen(null); }}
                      className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                    >
                      {t('allEmirates') ?? 'All Emirates'}
                    </button>
                    {EMIRATES_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setEmirate(opt.value); setDropdownOpen(null); }}
                        className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-[10px] shrink-0">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="h-[48px] flex-1 sm:flex-none sm:w-[130px] rounded-[12px] bg-[#781E36] px-4 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  {t('search') ?? 'Filter'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-[48px] px-4 rounded-[12px] bg-[#FAEDE6] text-sm font-bold text-[#781E36] border border-[#E8CFC1] hover:bg-[#F3D9CE] transition-colors"
                >
                  {t('reset') ?? 'Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-base font-normal text-[#6B5B57]">
                {t('noInitiatives') ?? 'No initiatives found.'}
              </p>
              <Button onClick={handleReset} variant="primary">
                {t('reset') ?? 'Reset filters'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/initiatives/${item.slug}`}
                  className="group flex flex-col w-full rounded-[20px] border border-[#E8CFC1] bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0px_10px_30px_-10px_#781E3630]"
                  style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}
                >
                  <div className="relative w-full aspect-[16/10] bg-[#E8CFC1] overflow-hidden">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={getTitle(item)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#98142f] via-[#781E36] to-[#3f1220]" />
                    )}
                    {item.badge && (
                      <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#781E36] shadow-sm">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col p-5 gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-bold leading-snug text-[#781E36] line-clamp-2">
                        {getTitle(item)}
                      </h3>
                      {getSubtitle(item) && (
                        <p className="text-sm text-[#6B5B57] line-clamp-3 leading-5">
                          {getSubtitle(item)}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#E8CFC1]">
                      <span className="text-xs font-semibold text-[#989898]">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#781E36]">
                        {t('viewDetails') ?? 'View details'}
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={meta.totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </Reveal>

      {showTopics && topics.length > 0 && (
      <Reveal delay={0.25} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-6 w-full bg-white border-t border-b border-[#E8CFC1] py-8 px-4 sm:px-8">
            <div className="flex flex-col gap-[6px] px-4">
              <span className="text-xl font-bold leading-7 text-[#781E36]">{t('exploreTopics') ?? 'Explore Topics'}</span>
              <span className="text-sm font-normal text-[#6B5B57]">{t('exploreTopicsText') ?? 'Browse available initiative categories'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 w-full h-auto min-h-[125px] rounded-[16px] border border-[#E8CFC1] bg-white p-4 cursor-pointer hover:border-[#781E36] transition-colors"
                >
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FAEDE6]">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none"><path d="M9 0L11.59 5.41L17 6.18L13 10.64L14.18 16L9 13.77L3.82 16L5 10.64L1 6.18L6.41 5.41L9 0Z" fill="#781E36" /></svg>
                  </div>
                  <span className="text-center text-base font-semibold leading-4 text-[#781E36]">{topic.title}</span>
                  <span className="text-center text-base font-normal leading-[15px] text-[#6B5B57]">{topic.videos}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      )}

      {showContributors && contributorList.length > 0 && (
      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-6 w-full bg-white pt-[30px] pb-[48px] px-4 sm:px-8">
            <span className="text-xl font-bold leading-7 text-[#781E36]">{t('contributors') ?? 'Trusted Contributors'}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contributorList.map((item, i) => (
                <div key={i} className="flex items-center gap-[12px] w-full h-auto min-h-[74px] rounded-[16px] border border-[#E8CFC1] bg-white p-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="#781E36" strokeWidth="1.5" /><path d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18" stroke="#781E36" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                  <span className="text-base font-semibold leading-[15px] text-[#781E36]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      )}

      {showFaqs && faqs.length > 0 && (
      <Reveal delay={0.35} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-[#781E36] leading-tight">{t('faqTitle') ?? 'Frequently Asked Questions'}</h2>
            <p className="text-base font-normal text-[#6B5B57] max-w-[640px]">{t('faqText') ?? 'Find answers to common questions about our initiatives'}</p>
          </div>
          <div className="flex flex-col gap-5 max-w-[663px] mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="w-full rounded-[10px] border-[0.5px] border-[#959595] bg-white p-[10px] flex flex-col gap-[10px] cursor-pointer hover:border-[#781E36] transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between w-full h-auto min-h-[30px] gap-3">
                  <span className="text-base md:text-lg font-semibold text-[#781E36] leading-[150%]">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#781E36] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && <p className="text-sm font-normal text-[#6B5B57] leading-5 pt-2">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      )}

      {showCta && (
      <Reveal delay={0.4} direction="up">
        <div className="w-full pb-[80px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div
              className="relative flex h-auto min-h-[464px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[80px] text-center text-white md:px-[80px]"
              style={{ background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center max-w-[848px]">
                <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-6">{t('ctaTitle') ?? 'Explore Marriage Support Initiatives'}</h2>
                <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-10">{t('ctaText') ?? 'Discover programs designed to support your journey'}</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="#initiatives" className="flex h-[64px] w-full sm:w-[221px] items-center justify-center gap-2 rounded-full bg-white px-8 py-[18px] font-extrabold text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors">{t('ctaBrowse') ?? 'Browse Initiatives'}</Link>
                  <Link href="/emirates" className="flex h-[64px] w-full sm:w-[221px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-[18px] font-extrabold text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors">{t('ctaExplore') ?? 'Explore Emirates'}</Link>
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
