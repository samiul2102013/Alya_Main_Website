'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, Link2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { localizeTitle, localizeEmirate, localizeCity, localizeOrganization, localizeResource, formatLocalizedDate } from '@/lib/localize-category';
import { pickLocalized } from '@/lib/auto-translate';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { getPublishedNews, getNewsBySlug, type PublicNewsDetail, type PublicNews } from '@/lib/api/news';

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

interface InfoValues {
  org: string;
  city: string;
  emirates: string;
  author: string;
  published: string;
}

interface StoryItem {
  title: string;
}

const storyImages = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
];

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop';

function useArticle(slugParam: string | null, fallbackTitle: string): {
  title: string;
  content: string[];
  cover: string;
  info: InfoValues;
  resources: string[];
  stories: { title: string; image: string; slug?: string }[];
  showArticleInfo: boolean;
  showRelatedResources: boolean;
  showShare: boolean;
  showRelatedStories: boolean;
  notFound: boolean;
} {
  const t = useTranslations('article');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const mockInfo = t.raw('infoValues') as InfoValues;
  const mockResources = t.raw('resources') as string[];
  const mockStories = (t.raw('stories') as StoryItem[]).map((s, i) => ({
    ...s,
    image: storyImages[i % storyImages.length],
  }));

  const [state, setState] = useState({
    title: fallbackTitle,
    content: [t('p1'), t('p2'), t('p3'), t('p4')],
    cover: HERO_FALLBACK,
    info: mockInfo,
    resources: mockResources,
    stories: mockStories,
    showArticleInfo: true,
    showRelatedResources: true,
    showShare: true,
    showRelatedStories: true,
    notFound: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let detail: PublicNewsDetail | null = null;
      try {
        if (slugParam) {
          detail = await getNewsBySlug(slugParam);
          if (!detail) {
            if (!cancelled) setState((s) => ({ ...s, notFound: true }));
            return;
          }
        } else {
          const list = await getPublishedNews();
          if (list?.[0]) {
            detail = await getNewsBySlug(list[0].slug);
          }
        }
      } catch {
        /* ignore */
      }

      if (cancelled || !detail) return;

      const rawContent = pickLocalized(detail.content, (detail as any).contentAr, isArabic);
      const paragraphs = rawContent
        ? rawContent.split(/\n\n+/).filter(Boolean)
        : [t('p1'), t('p2'), t('p3'), t('p4')];

      const resourceTitles = Array.isArray(detail.resources)
        ? detail.resources
            .map((r) => (isArabic && r.titleAr ? r.titleAr : r.title || r.url || ''))
            .filter(Boolean)
        : mockResources;

      setState({
        title: pickLocalized(detail.articleTitle, detail.articleTitleAr, isArabic) || fallbackTitle,
        content: paragraphs.length ? paragraphs : [t('p1'), t('p2'), t('p3'), t('p4')],
        cover: detail.coverImage || HERO_FALLBACK,
        info: {
          org: (isArabic ? detail.organizationAr : '') || detail.organization || mockInfo.org,
          city: (isArabic ? detail.cityAr : '') || detail.city || mockInfo.city,
          emirates: detail.emirate || mockInfo.emirates,
          author: pickLocalized(detail.author, (detail as any).authorAr, isArabic) || mockInfo.author,
          published: detail.publishedDate || mockInfo.published,
        },
        resources: resourceTitles.length ? resourceTitles : mockResources,
        stories:
          detail.relatedStories?.length
            ? detail.relatedStories.map((rs: PublicNews['id'] extends unknown ? any : any, i: number) => ({
                title: pickLocalized(rs.articleTitle, rs.articleTitleAr, isArabic),
                image: rs.coverImage || storyImages[i % storyImages.length],
                slug: rs.slug,
              }))
            : mockStories,
        showArticleInfo: detail.showArticleInfo ?? true,
        showRelatedResources: detail.showRelatedResources ?? true,
        showShare: detail.showShare ?? true,
        showRelatedStories: detail.showRelatedStories ?? true,
        notFound: false,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam]);

  return state;
}

export default function ArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <ArticlePageInner />
    </Suspense>
  );
}

function ArticlePageInner() {
  const t = useTranslations('article');
  const tnav = useTranslations('nav');
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  const { title, content, cover, info, resources, stories, showArticleInfo, showRelatedResources, showShare, showRelatedStories, notFound } = useArticle(
    slugParam,
    t('title'),
  );

  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      const input = document.createElement('textarea');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (notFound) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-base font-normal text-[#6B5B57]">{t('title')} unavailable.</p>
        <Link href="/news" className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors">Back to News</Link>
      </div>
    );
  }

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const infoRows = [
    { label: t('org'), value: localizeOrganization(info.org, isArabic) },
    { label: t('city'), value: localizeCity(info.city, isArabic) },
    { label: t('emirates'), value: localizeEmirate(info.emirates, isArabic) },
    { label: t('author'), value: info.author },
    { label: t('published'), value: formatLocalizedDate(info.published, isArabic) || info.published },
  ];
  const localizedResources = resources.map((r) => localizeResource(r, isArabic));

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tnav('home'), href: '/' },
            { label: tnav('news'), href: '/news' },
            { label: title },
          ]} />
        </div>
      </Reveal>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-[30px]">
          <Reveal delay={0.1} direction="up" className="w-full lg:max-w-[853px]">
            <div className="flex flex-col w-full lg:max-w-[853px] rounded-[20px] bg-white p-4 sm:p-8 gap-6"
              style={{ boxShadow: '0px 4px 20px 0px #781E360A' }}>
              <motion.div
                className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-[16px] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={cover} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 853px" priority />
              </motion.div>

              <motion.h1
                className="max-w-[714px] text-2xl sm:text-3xl lg:text-[28px] font-bold text-[#781E36] leading-snug"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {title}
              </motion.h1>

              <motion.div
                className="flex flex-col gap-4 text-sm sm:text-base text-[#6B5B57] leading-relaxed"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
              >
                {content.map((paragraph, i) => (
                  <motion.p key={i} variants={itemVariants}>{paragraph}</motion.p>
                ))}
              </motion.div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 w-full lg:max-w-[400px]">
            {showArticleInfo && (
            <Reveal delay={0.2} direction="right">
              <div className="flex flex-col gap-3 w-full rounded-[20px] border border-[#E8CFC1] bg-white p-5"
                style={{ boxShadow: '0px 2px 8px 0px #781E3605' }}>
                <motion.div
                  className="flex flex-col gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-base font-semibold text-[#781E36]">
                    {t('articleInfo')}
                  </motion.span>
                  {infoRows.map((row, i) => (
                    <motion.div key={i} variants={itemVariants}
                      className="flex items-center justify-between w-full py-2 border-b border-[#E8CFC1] last:border-b-0">
                      <span className="text-[13px] font-normal text-[#6B5B57] leading-snug">{row.label}</span>
                      <span className="text-[13px] font-semibold text-[#781E36] leading-snug">{row.value}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
            )}

            {showRelatedResources && (
            <Reveal delay={0.25} direction="right">
              <div className="flex flex-col gap-3 w-full rounded-[20px] border border-[#E8CFC1] bg-white p-5"
                style={{ boxShadow: '0px 2px 8px 0px #781E3605' }}>
                <motion.div
                  className="flex flex-col gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-base font-semibold text-[#781E36]">
                    {t('relatedResources')}
                  </motion.span>
                  {localizedResources.map((res, i) => (
                    <motion.div key={i} variants={itemVariants}
                      className="flex items-center justify-between w-full py-2 border-b border-[#E8CFC1] last:border-b-0">
                      <span className="text-[13px] font-normal text-[#6B5B57] leading-snug">{res}</span>
                      <ExternalLink className="h-[18px] w-[18px] text-[#6B5B57] opacity-60 cursor-pointer hover:text-[#781E36] rtl:rotate-180" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
            )}



            {showShare && (
            <Reveal delay={0.3} direction="right">
              <div className="flex flex-col gap-3 w-full rounded-[20px] border border-[#E8CFC1] bg-white p-5"
                style={{ boxShadow: '0px 2px 8px 0px #781E3605' }}>
                <motion.div
                  className="flex flex-col gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-base font-semibold text-[#781E36]">
                    {t('share')}
                  </motion.span>
                  <motion.div className="flex flex-wrap items-center gap-4 mt-1" variants={containerVariants}>
                    <motion.a
                      variants={itemVariants}
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <span className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-[#FAEDE6] border border-[#E8CFC1] group-hover:border-[#781E36] transition-colors">
                        <svg className="h-5 w-5 text-[#781E36]" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                      </span>
                      <span className="text-xs font-medium text-[#6B5B57]">{t('facebook')}</span>
                    </motion.a>
                    <motion.a
                      variants={itemVariants}
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <span className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-[#FAEDE6] border border-[#E8CFC1] group-hover:border-[#781E36] transition-colors">
                        <svg className="h-5 w-5 text-[#781E36]" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                      </span>
                      <span className="text-xs font-medium text-[#6B5B57]">{t('x')}</span>
                    </motion.a>
                    <motion.button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label={t('copyLink')}
                      variants={itemVariants}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <span className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-[#FAEDE6] border border-[#E8CFC1] group-hover:border-[#781E36] transition-colors">
                        <Link2 className="h-5 w-5 text-[#781E36]" />
                      </span>
                      <span className="text-xs font-medium text-[#6B5B57]">{copied ? t('copied') : t('copyLink')}</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </Reveal>
            )}

            {showRelatedStories && (
            <Reveal delay={0.35} direction="right">
              <div className="flex flex-col gap-4 w-full rounded-[20px] border border-[#E8CFC1] bg-white p-5"
                style={{ boxShadow: '0px 2px 8px 0px #781E3605' }}>
                <motion.div
                  className="flex flex-col gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-base font-semibold text-[#781E36]">
                    {t('relatedStories')}
                  </motion.span>
                  {stories.map((story, i) => (
                    <motion.div key={i} variants={itemVariants}>
                      <Link
                        href={story.slug ? `/news/article?slug=${encodeURIComponent(story.slug)}` : '/news/article'}
                        className="flex items-center gap-[12px] w-full min-h-[60px]"
                      >
                        <div className="relative w-[80px] h-[60px] shrink-0 rounded-[12px] overflow-hidden">
                          <Image src={story.image} alt={story.title} fill className="object-cover" sizes="80px" />
                        </div>
                        <span className="text-sm font-medium leading-[18px] text-[#781E36]">{story.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
