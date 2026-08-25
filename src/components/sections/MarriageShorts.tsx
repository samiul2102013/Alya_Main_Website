'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Heading from '../shared/Heading';
import { Play, Clock, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import type { PublicShort } from '@/lib/api/shorts';
import { getPublishedShorts } from '@/lib/api/shorts';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
];

export default function MarriageShorts() {
  const t = useTranslations('home');
  const [videos, setVideos] = useState<PublicShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPublishedShorts()
      .then((items) => {
        if (mounted) setVideos(items.slice(0, 4));
      })
      .catch(() => {
        /* stay empty on error */
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Section background="default" spacing="none" id="shorts" containerClassName="!max-w-[1440px]" className="py-[64px] sm:py-[80px]">
      {/* Header Container: width 1280, height 80, space-between */}
      <Reveal direction="up">
        <div className="flex flex-col items-center text-center gap-4 min-h-[80px] mb-12">
          <Heading
            level={2}
            align="center"
            subtitle={t('shortsSubtitle')}
          >
            {t('shortsTitle')}
          </Heading>
        </div>
      </Reveal>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-[460px] sm:h-[504px] w-full max-w-[295px] mx-auto rounded-[20px] border border-[#E8CFC1] bg-[#FAEDE6]/60 animate-pulse flex items-center justify-center"
            >
              <Loader2 className="h-6 w-6 text-[#781E36] animate-spin" />
            </div>
          ))
        ) : videos.length === 0 ? (
          <p className="col-span-full text-center text-sm font-normal text-[#6B5B57] py-8">
            {t('shortsEmpty')}
          </p>
        ) : (
          videos.map((short, index) => (
            <Reveal key={short.id || index} delay={index * 0.1} direction="up">
              <Link href={`/shorts/${short.slug}`}>
                <div className="group relative h-[460px] sm:h-[504px] w-full max-w-[295px] mx-auto rounded-[20px] border border-[#781E36] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-2 hover:border-[#781E36]">
                  {/* Full Background Image */}
                  <Image
                    src={short.coverImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={short.videoTitle}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 295px"
                  />

                  {/* Dark Gradient Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                  {/* All Content Overlay */}
                  <div className="relative z-10 flex h-full flex-col pt-[30px] px-[15px] pb-[30px]">
                    {/* Top Row: Category Badge + Duration */}
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#781E36] shadow-xs backdrop-blur-md">
                        {short.category}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <Clock className="h-3 w-3 text-[#E8CFC1]" />
                        {short.duration}
                      </span>
                    </div>

                    {/* Play Button - centered */}
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#781E36] shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#781E36] group-hover:text-white">
                        <Play className="h-5 w-5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Section: Title + Date/CTA */}
                    <div className="flex flex-col gap-4">
                      <h3 className="min-h-[50px] text-base font-bold leading-snug text-white group-hover:text-[#E8CFC1] transition-colors line-clamp-2">
                        {short.videoTitle}
                      </h3>
                      <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                        <span className="flex items-center gap-[4px] h-[20px]">
                          <Calendar className="h-3.5 w-3.5 text-[#E8CFC1]" />
                          <span className="leading-none">
                            {short.publishedAt
                              ? new Date(short.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : ''}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#E8CFC1] group-hover:underline h-[20px] leading-none">
                          {t('shortsWatchReel')} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))
        )}
      </div>
    </Section>
  );
}