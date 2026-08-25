'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Heading from '../shared/Heading';
import Pagination from '../shared/Pagination';
import { Calendar, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getPublishedNewsPage } from '@/lib/api/news';
import { homeContent } from '@/lib/mock-data/home';

const fallbackImages = homeContent.latestNews.map((n) => n.image.src);
const ITEMS_PER_PAGE = 9;

interface NewsDisplayItem {
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  slug?: string;
}

function useLatestNews(
  fallback: { tag: string; date: string; title: string; excerpt: string }[],
  fallbackImgs: string[],
): { items: NewsDisplayItem[]; page: number; totalPages: number; setPage: (p: number) => void } {
  const [items, setItems] = useState<NewsDisplayItem[]>(() =>
    fallback.map((n, i) => ({ ...n, image: fallbackImgs[i % fallbackImgs.length] })),
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    // fallback / fallbackImgs are stable seed/translation data for when the API returns empty.
    getPublishedNewsPage({ page: String(page), perPage: String(ITEMS_PER_PAGE) })
      .then(({ data, meta }) => {
        if (cancelled) return;
        if (!data.length) {
          setItems(
            fallback.map((n, i) => ({ ...n, image: fallbackImgs[i % fallbackImgs.length] })),
          );
          setTotalPages(1);
          return;
        }
        const mapped: NewsDisplayItem[] = data.map((n) => ({
          tag: n.category || 'News',
          date: n.publishedDate || new Date().toISOString().slice(0, 10),
          title: n.articleTitle,
          excerpt: n.articleTitle,
          image: n.coverImage || fallbackImgs[0],
          slug: n.slug,
        }));
        setItems(mapped);
        setTotalPages(meta.totalPages);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { items, page, totalPages, setPage };
}

export default function LatestNews() {
  const t = useTranslations('home');
  const fallbackItems = t.raw('news') as { tag: string; date: string; title: string; excerpt: string }[];
  const { items, page, totalPages, setPage } = useLatestNews(fallbackItems, fallbackImages);
  const onPageChange = useCallback((p: number) => setPage(p), [setPage]);

  return (
    <Section background="muted" spacing="none" id="news" containerClassName="!max-w-[1440px]" className="py-[64px] sm:py-[80px]">
      <div className="flex flex-col gap-[64px]">
        {/* Header Container: width 1280, height 104, gap 16 */}
        <Reveal direction="up">
          <div className="flex flex-col items-center text-center gap-4 min-h-[104px]">
            <Heading
              level={2}
              align="center"
              subtitle={t('newsSubtitle')}
            >
              {t('newsTitle')}
            </Heading>
          </div>
        </Reveal>

        {/* Grid of 3 News Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {items.map((news, index) => (
          <Reveal key={index} delay={index * 0.1} direction="up">
            <Link
              href={news.slug ? `/news/article?slug=${encodeURIComponent(news.slug)}` : '/news/article'}
              className="block"
            >
              <div
                className="group flex h-auto min-h-[519px] w-full max-w-[400px] mx-auto flex-col justify-between overflow-hidden rounded-[24px] border border-[#E8CFC1] bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#781E36]"
                style={{
                  boxShadow:
                    '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              >
              {/* News Image */}
              <div className="relative h-[200px] sm:h-[230px] w-full overflow-hidden bg-gray-100">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#781E36] backdrop-blur-md shadow-xs">
                  {news.tag}
                </span>
              </div>

              {/* News Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6B5B57]">
                    <Calendar className="h-3.5 w-3.5 text-[#781E36]" />
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-[#781E36] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="line-clamp-3 text-xs md:text-sm leading-relaxed text-[#6B5B57]">
                    {news.excerpt}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E8CFC1]/60 pt-4 text-xs font-bold text-[#781E36]">
                  <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    {t('newsReadMore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                  <Bookmark className="h-4 w-4 text-gray-400 hover:text-[#781E36] transition-colors" />
                </div>
              </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {totalPages > 1 && (
        <Reveal direction="up">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </Reveal>
      )}
      </div>
    </Section>
  );
}
