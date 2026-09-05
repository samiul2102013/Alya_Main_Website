'use client';

import { Suspense, useCallback, useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, Search as SearchIcon } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Button from '@/components/shared/Button';
import Reveal from '@/components/shared/Reveal';
import { Link } from '@/i18n/navigation';
import { getGlobalSearch, type GlobalSearchResult } from '@/lib/api/search';

type GroupKey = 'shorts' | 'news' | 'consultations' | 'initiatives' | 'emirates';

const GROUP_KEYS: GroupKey[] = ['initiatives', 'news', 'consultations', 'shorts', 'emirates'];

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const t = useTranslations('search');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [input, setInput] = useState(searchParams.get('q') ?? '');
  const [result, setResult] = useState<GlobalSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GroupKey | 'all'>('all');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const q = query.trim();
    if (!q) {
      setResult(null);
      return;
    }
    setLoading(true);
    getGlobalSearch(q)
      .then((r) => {
        if (mounted) setResult(r);
      })
      .catch(() => {
        if (mounted) setResult({ q, shorts: [], news: [], consultations: [], initiatives: [], emirates: [] });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [query]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setQuery(input.trim());
    router.push(`/search?q=${encodeURIComponent(input.trim())}`, { scroll: false });
  }

  const countFor = useCallback(
    (key: GroupKey) => (result ? result[key].length : 0),
    [result],
  );

  const totalResults = useCallback(
    () => (result ? GROUP_KEYS.reduce((acc, k) => acc + result[k].length, 0) : 0),
    [result],
  );

  const showEmptyQuery = !query.trim();
  const showNoResults = !!query.trim() && !loading && result && totalResults() === 0;

  const visibleGroups: GroupKey[] =
    selected === 'all' ? GROUP_KEYS.filter((k) => countFor(k) > 0) : (selected === 'emirates' || selected === 'shorts' || selected === 'news' || selected === 'consultations' || selected === 'initiatives') && countFor(selected) > 0 ? [selected] : [];

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[{ label: nav('home'), href: '/' }, { label: t('title') }]} />
        </div>
      </Reveal>

      <Reveal delay={0.05} direction="up">
        <section className="w-full bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#781E36] mb-2">{t('title')}</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-[820px]"
            >
              <div className="flex items-center gap-[10px] w-full h-[52px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
                <SearchIcon className="h-5 w-5 text-[#989898] shrink-0" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('placeholder')}
                  className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
                />
              </div>
              <Button type="submit" variant="primary" className="h-[52px] sm:w-auto">
                {t('button')}
              </Button>
            </form>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 py-8">
        {showEmptyQuery && (
          <p className="text-base text-[#6B5B57] py-16 text-center">{t('emptyQuery')}</p>
        )}

        {showNoResults && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-base text-[#6B5B57]">{t('noResults')}</p>
            <p className="text-lg font-bold text-[#781E36]">“{query}”</p>
          </div>
        )}

        {!!query.trim() && !loading && result && totalResults() > 0 && (
          <>
            <Reveal delay={0.1} direction="up">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setSelected('all')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    selected === 'all' ? 'bg-[#781E36] text-white' : 'bg-white text-[#6B5B57] hover:text-[#781E36]'
                  }`}
                >
                  {t('all')}
                </button>
                {GROUP_KEYS.map((k) =>
                  countFor(k) > 0 ? (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelected(k)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        selected === k ? 'bg-[#781E36] text-white' : 'bg-white text-[#6B5B57] hover:text-[#781E36]'
                      }`}
                    >
                      {t(sectionKey(k))}
                    </button>
                  ) : null,
                )}
              </div>
            </Reveal>

            {visibleGroups.map((k) => (
              <GroupSection
                key={k}
                group={k}
                items={result[k]}
                count={countFor(k)}
                title={t(sectionKey(k))}
                isArabic={isArabic}
              />
            ))}
          </>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
          </div>
        )}
      </div>
    </div>
  );
}

function sectionKey(k: GroupKey): 'sectionInitiatives' | 'sectionNews' | 'sectionConsultations' | 'sectionShorts' | 'sectionEmirates' {
  switch (k) {
    case 'initiatives': return 'sectionInitiatives';
    case 'news': return 'sectionNews';
    case 'consultations': return 'sectionConsultations';
    case 'shorts': return 'sectionShorts';
    case 'emirates': return 'sectionEmirates';
  }
}

function GroupSection({
  group,
  items,
  count,
  title,
  isArabic,
}: {
  group: GroupKey;
  items: GroupItems;
  count: number;
  title: string;
  isArabic: boolean;
}) {
  const t = useTranslations('search');
  if (count === 0) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#781E36]">{title}</h2>
        <span className="text-xs font-semibold text-[#989898]">{count}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.slice(0, 6).map((item, i) => (
          <SearchCard key={item.id ?? i} group={group} item={item} isArabic={isArabic} />
        ))}
      </div>
    </div>
  );
}

type GroupItems = GlobalSearchResult['shorts'] | GlobalSearchResult['news'] | GlobalSearchResult['consultations'] | GlobalSearchResult['initiatives'] | GlobalSearchResult['emirates'];

function SearchCard({ group, item, isArabic }: { group: GroupKey; item: any; isArabic: boolean }) {
  const t = useTranslations('search');
  const { href, image, title } = cardMeta(group, item, isArabic);
  return (
    <Link
      href={href}
      className="group flex flex-col w-full rounded-[20px] border border-[#E8CFC1] bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0px_10px_30px_-10px_#781E3630]"
      style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}
    >
      <div className="relative w-full aspect-[16/9] bg-[#E8CFC1] overflow-hidden">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 380px" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#98142f] via-[#781E36] to-[#3f1220]" />
        )}
      </div>
      <div className="flex flex-col p-4 gap-2 flex-1">
        <h3 className="text-base font-bold leading-snug text-[#781E36] line-clamp-2">{title}</h3>
        <span className="mt-auto flex items-center gap-1 text-xs font-bold text-[#B83A4A]">
          {t('viewAll')}
          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}

function cardMeta(
  group: GroupKey,
  item: any,
  isArabic: boolean,
): { href: string; image: string; title: string } {
  switch (group) {
    case 'initiatives':
      return {
        href: `/initiatives/${item.slug}`,
        image: item.coverImage,
        title: isArabic && item.titleAr ? item.titleAr : item.title,
      };
    case 'news':
      return {
        href: item.slug ? `/news/article?slug=${encodeURIComponent(item.slug)}` : '/news',
        image: item.coverImage,
        title: item.articleTitle,
      };
    case 'consultations':
      return {
        href: `/consultation/details?slug=${item.slug}`,
        image: item.coverImage || '',
        title: item.sessionTitle,
      };
    case 'shorts':
      return {
        href: `/shorts/${item.slug}`,
        image: item.coverImage,
        title: isArabic && item.videoTitleAr ? item.videoTitleAr : item.videoTitle,
      };
    case 'emirates':
      return {
        href: `/emirates/${item.slug}`,
        image: item.image || '',
        title: isArabic && item.emiratesNameAr ? item.emiratesNameAr : item.emiratesName,
      };
  }
}