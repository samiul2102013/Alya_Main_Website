'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2, Search, ChevronDown } from 'lucide-react';
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

const PER_PAGE = 9;

export default function InitiativesPage() {
  const t = useTranslations('initiative');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [items, setItems] = useState<PublicInitiative[]>([]);
  const [meta, setMeta] = useState({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState('');
  const [emirate, setEmirate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<'emirate' | null>(null);

  function buildParams() {
    const p: Record<string, string> = { page: String(page), perPage: String(PER_PAGE), listed: '1' };
    if (query.trim()) p.search = query.trim();
    if (emirate) p.emirate = emirate;
    return p;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPublishedInitiativesPage(buildParams())
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

  function handleApply() {
    setPage(1);
    setLoading(true);
    getPublishedInitiativesPage(buildParams())
      .then(({ data, meta: m }) => {
        setItems(data);
        setMeta(m);
      })
      .finally(() => setLoading(false));
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

      <Reveal delay={0.05} direction="up">
        <section className="w-full bg-white mb-10">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col gap-3 max-w-[820px]">
              <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[44px] leading-tight">
                {t('browseInitiatives')}
              </h1>
              <p className="text-base sm:text-lg text-[#6B5B57] leading-relaxed">
                {t('description')}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.1} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px] w-full h-[48px] sm:h-[61px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
              <Search className="h-5 w-5 text-[#989898] shrink-0" />
              <input
                type="text"
                placeholder={t('searchPlaceholder') ?? 'Search initiatives...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="relative w-full">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-[10px] w-full">
              <button
                type="button"
                onClick={handleApply}
                className="w-full h-[52px] rounded-[12px] bg-[#781E36] px-6 py-3 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors sm:flex-1"
              >
                {t('search') ?? 'Search'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto h-[52px] rounded-[12px] bg-[#FAEDE6] px-6 py-3 text-sm font-bold text-[#781E36] border border-[#E8CFC1] hover:bg-[#F3D9CE] transition-colors"
              >
                {t('reset') ?? 'Reset'}
              </button>
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
    </div>
  );
}
