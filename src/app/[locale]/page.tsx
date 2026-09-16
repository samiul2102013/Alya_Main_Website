'use client';
import React from 'react';
import { useLocale } from 'next-intl';
import Hero from '@/components/sections/Hero';
import FeatureGrid from '@/components/sections/FeatureGrid';
import MarriageShorts from '@/components/sections/MarriageShorts';
import LatestNews from '@/components/sections/LatestNews';
import UpcomingInitiatives from '@/components/sections/UpcomingInitiatives';
import ConsultationSessions from '@/components/sections/ConsultationSessions';
import ExploreByEmirate from '@/components/sections/ExploreByEmirate';
import CTA from '@/components/sections/CTA';
import { useHomepageContent, DEFAULT_SECTION_VISIBILITY } from '@/hooks/useHomepageContent';

export default function HomePage() {
  const { sectionVisibility, notFound } = useHomepageContent();
  const locale = useLocale();
  const vis = { ...DEFAULT_SECTION_VISIBILITY, ...sectionVisibility };

  if (notFound) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-base font-normal text-[#6B5B57]">{locale === 'ar' ? 'المحتوى غير متوفر.' : 'This content is not available.'}</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      {vis.stats && <FeatureGrid />}
      {vis.shorts && <MarriageShorts />}
      {vis.news && <LatestNews />}
      {vis.initiatives && <UpcomingInitiatives />}
      {vis.consultations && <ConsultationSessions />}
      {vis.emirates && <ExploreByEmirate />}
      {vis.cta && <CTA />}
    </>
  );
}
