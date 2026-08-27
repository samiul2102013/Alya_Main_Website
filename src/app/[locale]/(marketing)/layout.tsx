'use client';
import React from 'react';
import ScrollToTop from '@/components/shared/ScrollToTop';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ScrollToTop />
    </>
  );
}
