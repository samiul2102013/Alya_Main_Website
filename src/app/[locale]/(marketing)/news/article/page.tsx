'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
} {
  const t = useTranslations('article');

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
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let detail: PublicNewsDetail | null = null;
      try {
        if (slugParam) {
          detail = await getNewsBySlug(slugParam);
        }
        if (!detail) {
          const list = await getPublishedNews();
          if (list?.[0]) {
            detail = await getNewsBySlug(list[0].slug);
          }
        }
      } catch {
        /* ignore */
      }

      if (cancelled || !detail) return;

      const paragraphs = detail.content
        ? detail.content.split(/\n\n+/).filter(Boolean)
        : [t('p1'), t('p2'), t('p3'), t('p4')];

      const resourceTitles = Array.isArray(detail.resources)
        ? (detail.resources as { title?: string; url?: string }[])
            .map((r) => r.title || r.url || '')
            .filter(Boolean)
        : mockResources;

      setState({
        title: detail.articleTitle || fallbackTitle,
        content: paragraphs.length ? paragraphs : [t('p1'), t('p2'), t('p3'), t('p4')],
        cover: detail.coverImage || HERO_FALLBACK,
        info: {
          org: detail.organization || mockInfo.org,
          city: detail.city || mockInfo.city,
          emirates: detail.emirate || mockInfo.emirates,
          author: detail.author || mockInfo.author,
          published: detail.publishedDate || mockInfo.published,
        },
        resources: resourceTitles.length ? resourceTitles : mockResources,
        stories:
          detail.relatedStories?.length
            ? detail.relatedStories.map((rs: PublicNews['id'] extends unknown ? any : any, i: number) => ({
                title: rs.articleTitle,
                image: rs.coverImage || storyImages[i % storyImages.length],
                slug: rs.slug,
              }))
            : mockStories,
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

  const { title, content, cover, info, resources, stories } = useArticle(
    slugParam,
    t('title'),
  );

  const infoRows = [
    { label: t('org'), value: info.org },
    { label: t('city'), value: info.city },
    { label: t('emirates'), value: info.emirates },
    { label: t('author'), value: info.author },
    { label: t('published'), value: info.published },
  ];

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
                  {resources.map((res, i) => (
                    <motion.div key={i} variants={itemVariants}
                      className="flex items-center justify-between w-full py-2 border-b border-[#E8CFC1] last:border-b-0">
                      <span className="text-[13px] font-normal text-[#6B5B57] leading-snug">{res}</span>
                      <ExternalLink className="h-[18px] w-[18px] text-[#6B5B57] opacity-60 cursor-pointer hover:text-[#781E36] rtl:rotate-180" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>

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
                  <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
                    <motion.button variants={itemVariants} type="button"
                      className="flex items-center gap-[6px] h-[30px] rounded-[8px] bg-[#FAEDE6] border border-[#E8CFC1] px-3 py-[6px] hover:border-[#781E36] transition-colors">
                      <Link2 className="h-[14px] w-[14px] text-[#781E36]" />
                      <span className="text-xs font-medium text-[#781E36] leading-tight">{t('copyLink')}</span>
                    </motion.button>
                    <motion.button variants={itemVariants} type="button"
                      className="flex items-center gap-[6px] h-[30px] rounded-[8px] bg-[#FAEDE6] border border-[#E8CFC1] px-3 py-[6px] hover:border-[#781E36] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#781E36"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" /></svg>
                      <span className="text-xs font-medium text-[#781E36] leading-tight">{t('facebook')}</span>
                    </motion.button>
                    <motion.button variants={itemVariants} type="button"
                      className="flex items-center gap-[6px] h-[30px] rounded-[8px] bg-[#FAEDE6] border border-[#E8CFC1] px-3 py-[6px] hover:border-[#781E36] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#781E36"><path d="M4 4l6.5 8.5L4 20h1.5l5.5-7 4.5 7H20l-7-9.5L19.5 4H18l-5 6.5L8.5 4H4zM6.5 5.5h1.5l9 13h-1.5l-9-13z" /></svg>
                      <span className="text-xs font-medium text-[#781E36] leading-tight">{t('x')}</span>
                    </motion.button>
                    <motion.button variants={itemVariants} type="button"
                      className="flex items-center gap-[6px] h-[30px] rounded-[8px] bg-[#FAEDE6] border border-[#E8CFC1] px-3 py-[6px] hover:border-[#781E36] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#781E36"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                      <span className="text-xs font-medium text-[#781E36] leading-tight">{t('linkedin')}</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </Reveal>

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
          </div>
        </div>
      </div>
    </div>
  );
}
