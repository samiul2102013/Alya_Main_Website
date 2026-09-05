'use client';
import React from 'react';
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
  const { sectionVisibility } = useHomepageContent();
  const vis = { ...DEFAULT_SECTION_VISIBILITY, ...sectionVisibility };

  return (
    <>
      {vis.hero && <Hero />}
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
