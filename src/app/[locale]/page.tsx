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

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <MarriageShorts />
      <LatestNews />
      <UpcomingInitiatives />
      <ConsultationSessions />
      <ExploreByEmirate />
      <CTA />
    </>
  );
}
