'use client';
import React from 'react';
import ScrollToTop from '@/components/shared/ScrollToTop';
import ScrollToSection from '@/components/shared/ScrollToSection';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ScrollToTop />
      <ScrollToSection />
    </>
  );
}
