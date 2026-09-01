'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Button from '../shared/Button';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const t = useTranslations('home');
  const { content, localize, loading } = useHomepageContent();

  const sectionTitle = localize(content?.ctaTitle ?? '', content?.ctaTitleAr ?? '') || t('ctaTitle');
  const sectionSubtitle = localize(content?.ctaSubtitle ?? '', content?.ctaSubtitleAr ?? '') || t('ctaSubtitle');
  const primaryLabel = localize(content?.ctaPrimaryLabel ?? '', content?.ctaPrimaryLabelAr ?? '') || t('ctaExplore');
  const secondaryLabel = localize(content?.ctaSecondaryLabel ?? '', content?.ctaSecondaryLabelAr ?? '') || t('ctaFind');
  const primaryLink = content?.ctaPrimaryLink || '/initiatives';
  const secondaryLink = content?.ctaSecondaryLink || '/consultation';

  return (
    <Section background="default" spacing="none" id="cta" className="py-[64px] sm:py-[80px]">
      <Reveal direction="up">
        {/* Inside Container Info: width 1280, height 464, pt 80, pb 80, radius 40px, bg gradient */}
        <div
          className="relative mx-auto flex h-auto min-h-[464px] max-w-[1280px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[56px] sm:py-[80px] text-center text-white md:px-[80px]"
          style={{
            background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)',
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Animated Background Lights */}
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-[848px]">
            {/* Inside Header Info: max-w 848.88, height 144, pb 24 */}
            <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-[24px]">
              {sectionTitle}
            </h2>

            {/* Inside Description Info: max-w 672, height 96, pb 40 */}
            <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-[40px]">
              {sectionSubtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href={primaryLink}
                variant="white"
                width="221px"
                className="h-[64px] min-w-[221px] py-[18px] px-[32px] font-extrabold text-lg shadow-2xl"
                icon={<ArrowRight className="h-5 w-5 text-[#781E36] rtl:rotate-180" />}
              >
                {primaryLabel}
              </Button>
              <Button
                href={secondaryLink}
                variant="white"
                width="221px"
                className="h-[64px] min-w-[221px] py-[18px] px-[32px] font-extrabold text-lg shadow-2xl"
                icon={<ArrowRight className="h-5 w-5 text-[#781E36] rtl:rotate-180" />}
              >
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
