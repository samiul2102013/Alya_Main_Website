'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import Button from '../shared/Button';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const t = useTranslations('home');
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
              {t('ctaTitle')}
            </h2>

            {/* Inside Description Info: max-w 672, height 96, pb 40 */}
            <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-[40px]">
              {t('ctaSubtitle')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="#initiatives"
                variant="white"
                width="221px"
                className="h-[64px] min-w-[221px] py-[18px] px-[32px] font-extrabold text-lg shadow-2xl"
                icon={<ArrowRight className="h-5 w-5 text-[#781E36] rtl:rotate-180" />}
              >
                {t('ctaExplore')}
              </Button>
              <Button
                href="#consultation"
                variant="white"
                width="221px"
                className="h-[64px] min-w-[221px] py-[18px] px-[32px] font-extrabold text-lg shadow-2xl"
                icon={<ArrowRight className="h-5 w-5 text-[#781E36] rtl:rotate-180" />}
              >
                {t('ctaFind')}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
