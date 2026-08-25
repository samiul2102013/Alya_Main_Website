'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Share2, Link2, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import type { PublicShort, PublicShortDetail } from '@/lib/api/shorts';
import { getShortBySlug } from '@/lib/api/shorts';

const FALLBACK_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1661277709298-a91380f68daa?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
];

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

interface DetailItem {
  label: string;
  value: string;
}

export default function VideoDetailsPage() {
  const t = useTranslations('videoDetails');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [video, setVideo] = useState<PublicShortDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getShortBySlug(slug)
      .then((item) => {
        if (mounted) setVideo(item);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const isArabic = locale === 'ar';
  const title = video ? (isArabic && video.videoTitleAr ? video.videoTitleAr : video.videoTitle) : '';
  const description = video?.description || '';

  const details: DetailItem[] = video
    ? [
        { label: t('category'), value: video.category },
        { label: t('organization'), value: video.organization },
        { label: t('maritalStage'), value: video.maritalStage },
        { label: t('languageLabel'), value: video.language === 'ar' ? 'Arabic' : video.language === 'both' ? 'Both' : 'English' },
        { label: t('duration'), value: video.duration },
        { label: t('views'), value: String(video.views ?? 0) },
        { label: t('speaker'), value: video.speaker },
        { label: t('publishedDate'), value: video.publishedAt ? new Date(video.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US') : '' },
      ].filter((d) => d.value)
    : [];

  const keyTopics = video?.keyTopics?.length ? video.keyTopics : [];
  const resourcesList = video?.resources?.length
    ? video.resources.map((r) => (typeof r === 'string' ? r : (r as { title?: string }).title || ''))
    : [];
  const relatedVideos = video?.relatedVideos?.length ? video.relatedVideos : [];

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('shorts'), href: '/shorts' },
            { label: title || t('videoDetailsTitle') },
          ]} />
        </div>
      </Reveal>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#781E36]" />
        </div>
      ) : !video ? (
        <div className="flex justify-center py-24">
          <p className="text-base font-normal text-[#6B5B57]">
            {t('notFound')}
          </p>
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-[50px] w-full">
            <Reveal delay={0.1} direction="up">
              <div className="relative w-full aspect-video rounded-[20px] overflow-hidden flex items-center justify-center group"
                style={{ backgroundColor: '#101828', boxShadow: '0px 4px 6px -4px #0000001A, 0px 10px 15px -3px #0000001A' }}>
                {playing && video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    poster={video.coverImage || FALLBACK_IMAGES[0]}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full bg-black"
                  />
                ) : (
                  <>
                    <Image
                      src={video.coverImage || FALLBACK_IMAGES[0]}
                      alt={title}
                      fill
                      className="object-cover opacity-60"
                      sizes="100vw"
                    />
                    <button
                      type="button"
                      onClick={() => video.videoUrl && setPlaying(true)}
                      disabled={!video.videoUrl}
                      aria-label={t('play')}
                      className="relative flex items-center justify-center h-[80px] w-[80px] rounded-full bg-white/90 shadow-lg group-hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Play className="h-8 w-8 text-[#781E36] ml-1" fill="#781E36" />
                    </button>
                    {!video.videoUrl && (
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/70">
                        {t('noVideo')}
                      </span>
                    )}
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15} direction="up">
              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-[#781E36] leading-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-base md:text-lg font-normal text-[#6B5B57] leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2} direction="up">
              <div className="w-full rounded-[20px] border border-[#E8CFC180] bg-white p-4 sm:p-6">
                <motion.div
                  className="flex flex-col gap-6 w-full"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-lg font-semibold leading-7 text-[#781E36]">
                    {t('videoDetailsTitle')}
                  </motion.span>
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4" variants={containerVariants}>
                    {details.map((detail, i) => (
                      <motion.div key={i} variants={itemVariants} className="flex flex-col gap-1 w-full">
                        <span className="text-sm font-normal leading-5 text-[#6B5B57]">{detail.label}</span>
                        <span className="text-sm font-semibold leading-5 text-[#781E36]">{detail.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.25} direction="up">
              <div className="w-full rounded-[20px] border border-[#E8CFC180] bg-white p-6 sm:p-8">
                <motion.div
                  className="flex flex-col gap-4 w-full"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.span variants={itemVariants} className="text-lg font-semibold leading-7 text-[#781E36]">
                    {t('aboutTitle')}
                  </motion.span>
                  <motion.p variants={itemVariants} className="max-w-[1214px] text-base font-normal leading-7 text-[#6B5B57]">
                    {description || t('aboutText')}
                  </motion.p>
                  <motion.span variants={itemVariants} className="mt-4 text-lg font-semibold leading-7 text-[#781E36]">
                    {t('keyTopics')}
                  </motion.span>
                  <motion.div className="flex flex-wrap gap-3" variants={containerVariants}>
                    {keyTopics.map((topic, i) => (
                      <motion.div key={i} variants={itemVariants} className="flex items-center rounded-full border border-[#E8CFC180] bg-[#FAEDE6] px-4 py-2">
                        <span className="text-sm font-medium leading-5 text-[#781E36]">{topic}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.3} direction="up">
              <div className="flex flex-col lg:flex-row gap-[30px] w-full">
                <div className="flex flex-col w-full max-w-none lg:max-w-[624px] min-h-[352px] rounded-[20px] border border-[#E8CFC180] bg-white p-6 sm:p-8 gap-2">
                  <motion.div
                    className="flex flex-col gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: '-30px' }}
                  >
                    <motion.span variants={itemVariants} className="text-lg font-semibold leading-7 text-[#781E36]">
                      {t('resources')}
                    </motion.span>
                    <motion.p variants={itemVariants} className="text-sm font-normal leading-5 text-[#6B5B57]">
                      {t('resourcesText')}
                    </motion.p>
                    <motion.div className="flex flex-col gap-3 mt-2" variants={containerVariants}>
                      {resourcesList.map((label, i) => (
                        <motion.div key={i} variants={itemVariants}>
                          <Link href={video.shareUrl || '#'} className="flex items-center justify-between w-full h-[58px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 hover:border-[#781E36] transition-colors">
                            <div className="flex items-center gap-3">
                              <ExternalLink className="h-5 w-5 text-[#781E36]" />
                              <span className="text-sm font-medium text-[#6B5B57]">{label}</span>
                            </div>
                            <Share2 className="h-4 w-4 text-[#989898]" />
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

                <div className="flex flex-col w-full max-w-none lg:max-w-[624px] min-h-[352px] rounded-[20px] bg-white p-6 sm:p-8 gap-4"
                  style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}>
                  <motion.div
                    className="flex flex-col gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: '-30px' }}
                  >
                    <motion.span variants={itemVariants} className="text-lg font-semibold leading-7 text-[#781E36]">
                      {t('share')}
                    </motion.span>
                    <motion.div className="flex flex-wrap gap-4 mt-2" variants={containerVariants}>
                      {[
                        { icon: 'facebook', label: 'Facebook' },
                        { icon: 'twitter', label: 'Twitter' },
                        { icon: 'link', label: 'Copy Link' },
                      ].map((item, i) => {
                        const iconEl = item.icon === 'facebook' ? (
                          <svg className="h-5 w-5 text-[#781E36]" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        ) : item.icon === 'twitter' ? (
                          <svg className="h-5 w-5 text-[#781E36]" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                        ) : (
                          <Link2 className="h-5 w-5 text-[#781E36]" />
                        );
                        const url = item.icon === 'link'
                          ? 'https://marriagesupport.gov.ae'
                          : item.icon === 'facebook'
                            ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(video.shareUrl || 'https://marriagesupport.gov.ae')}`
                            : `https://twitter.com/intent/tweet?url=${encodeURIComponent(video.shareUrl || 'https://marriagesupport.gov.ae')}`;
                        return (
                          <motion.div key={i} variants={itemVariants} className="flex flex-col items-center gap-2 w-[58.11px] cursor-pointer group">
                            <a href={url} target={item.icon === 'link' ? undefined : '_blank'} rel="noreferrer"
                              className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-[#FAEDE6] border border-[#E8CFC1] group-hover:border-[#781E36] transition-colors">
                              {iconEl}
                            </a>
                            <span className="text-center text-xs font-medium leading-4 text-[#6B5B57]">{item.label}</span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.35} direction="up">
              <div className="flex flex-col gap-6 w-full">
                <span className="text-xl font-bold leading-7 text-[#781E36]">{t('relatedShorts')}</span>
                {relatedVideos.length === 0 ? (
                  <p className="text-sm font-normal text-[#6B5B57]">{t('noRelated')}</p>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: '-50px' }}
                  >
                    {relatedVideos.map((card, i) => (
                      <motion.div key={card.id || i} variants={itemVariants}>
                        <Link href={`/shorts/${card.slug}`} className="flex flex-col w-full rounded-[20px] border border-[#E8CFC1] bg-white overflow-hidden hover:shadow-lg transition-shadow"
                          style={{ boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A' }}>
                          <div className="relative w-full aspect-video bg-[#E8CFC1] overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${card.coverImage || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]})` }} />
                            <div className="absolute top-3 right-3 rounded bg-black/60 px-1.5 py-0.5">
                              <span className="text-[10px] font-medium leading-[15px] text-white">{card.duration}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M15.5 8.5L0.5 0.5V17.5L15.5 8.5Z" fill="#781E36" /></svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col p-4 gap-3 flex-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#989898]">{card.category}</span>
                            <span className="text-[15px] font-bold leading-5 text-[#781E36]">
                              {isArabic && card.videoTitleAr ? card.videoTitleAr : card.videoTitle}
                            </span>
                            <div className="flex items-center gap-3 mt-auto">
                              <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#989898"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                <span className="text-[11px] font-normal text-[#989898]">{card.views}</span>
                              </div>
                              <span className="text-[11px] font-normal text-[#989898]">
                                {card.publishedAt ? new Date(card.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="up">
              <div className="flex justify-center w-full pt-4">
                <Link href="/shorts" className="flex items-center justify-center h-[60px] w-full sm:w-[300px] rounded-[12px] bg-[#781E36] px-6 text-base font-bold text-white hover:bg-[#B83A4A] transition-colors">
                  {t('browseAll')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}