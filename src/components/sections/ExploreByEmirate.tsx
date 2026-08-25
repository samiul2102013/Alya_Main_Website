'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Heading from '../shared/Heading';
import { MapPin, Building2, ChevronRight } from 'lucide-react';
import { getPublishedEmirates } from '@/lib/api/emirates';

const fallbackImages = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465414829459-d228b58caf6e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=600&auto=format&fit=crop',
];

interface EmirateItem {
  name: string;
  title: string;
  centerCount: string;
  image: string;
}

export default function ExploreByEmirate() {
  const t = useTranslations('home');
  const fallback = t.raw('emirates') as { name: string; title: string; centerCount: string }[];
  const fallbackItems = fallback.map((item, i) => ({
    ...item,
    image: fallbackImages[i % fallbackImages.length],
  }));
  const [items, setItems] = useState<EmirateItem[]>(fallbackItems);
  const isCapital = (index: number) => index === 0;

  useEffect(() => {
    let cancelled = false;
    getPublishedEmirates()
      .then((list) => {
        if (cancelled || !list?.length) return;
        const mapped: EmirateItem[] = list.map((e, i) => ({
          name: e.emiratesName,
          title: e.title || e.emiratesName,
          centerCount: e.centerCount || '',
          image: e.image || fallbackImages[i % fallbackImages.length],
        }));
        setItems(mapped);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section background="default" spacing="none" id="emirates" className="py-[64px] sm:py-[80px]">
      {/* Text Header Container Info: width 1280, height 104, gap 16 */}
      <Reveal direction="up">
        <div className="flex flex-col items-center text-center gap-4 min-h-[104px] mb-12">
          <Heading
            level={2}
            align="center"
            subtitle={t('emiratesSubtitle')}
          >
            {t('emiratesTitle')}
          </Heading>
        </div>
      </Reveal>

      {/* Uniform Grid: All 7 Emirate Cards Share the Same Size on Every Breakpoint */}
      <div className="flex flex-wrap justify-center gap-5 sm:gap-6 max-w-[1280px] mx-auto">
        {items.map((item, index) => (
          <Reveal key={index} delay={index * 0.1} direction="up" className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]">
            <div className="group relative flex h-[320px] sm:h-[340px] lg:h-[380px] w-full flex-col justify-between overflow-hidden rounded-[24px] bg-white p-6 transition-all duration-500 hover:-translate-y-1.5"
              style={{
                boxShadow:
                  '0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

              {/* Top Emirate Badge */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#781E36] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                  {isCapital(index) && `${t('capitalRegion')} • `}
                  {item.name}
                </span>
                <span className="hidden items-center gap-1 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 sm:flex">
                  <MapPin className="h-3.5 w-3.5 text-[#E8CFC1]" />
                  {t('mainHeadquarters')}
                </span>
              </div>

              {/* Bottom Content Info */}
              <div className="relative z-10 text-white flex flex-col gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-200 flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4 text-[#E8CFC1] shrink-0" />
                  {item.centerCount}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#E8CFC1] group-hover:translate-x-2 transition-transform">
                  <span>{t('exploreCenters')}</span>
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
