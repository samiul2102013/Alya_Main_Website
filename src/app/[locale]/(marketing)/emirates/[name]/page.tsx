'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import {
  getEmirateBySlug,
  type PublicEmirateDetail,
  type PublicEmirateInitiative,
} from '@/lib/api/emirates';
import { EMIRATES_IMAGES } from '@/lib/image-pools';

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

interface EmirateEntry {
  title: string;
  subtitle: string;
}

interface Org {
  label: string;
  subtitle: string;
}

const emirateImages: Record<string, string> = {
  'abu-dhabi': EMIRATES_IMAGES[0],
  'dubai': EMIRATES_IMAGES[1],
  'sharjah': EMIRATES_IMAGES[2],
  'ajman': EMIRATES_IMAGES[3],
  'umm-al-quwain': EMIRATES_IMAGES[4],
  'ras-al-khaimah': EMIRATES_IMAGES[5],
  'fujairah': EMIRATES_IMAGES[6],
};

const fallbackInitiativeImages = [
  'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
];

const orgIcons = ['💒', '🏗️', '👪', '🌟'];

interface DisplayInitiative {
  slug: string;
  title: string;
  description: string;
  image: string;
  officialWebsiteUrl: string;
}

export default function EmirateDetailPage() {
  const params = useParams();
  const name = ((params.name as string) || '').toLowerCase().replace(/\s+/g, '-');
  const t = useTranslations('emirateDetail');
  const tNav = useTranslations('nav');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const emiratesData = t.raw('emiratesData') as Record<string, EmirateEntry>;
  const fallbackEntry = emiratesData[name] || emiratesData[Object.keys(emiratesData)[0]];

  const [emirate, setEmirate] = useState<PublicEmirateDetail | null>(null);
  const [initiatives, setInitiatives] = useState<DisplayInitiative[]>(() =>
    (t.raw('initiatives') as { title: string; description: string }[]).map((card, i) => ({
      slug: '',
      title: card.title,
      description: card.description,
      image: fallbackInitiativeImages[i % fallbackInitiativeImages.length],
      officialWebsiteUrl: '',
    })),
  );

  useEffect(() => {
    let cancelled = false;
    getEmirateBySlug(name)
      .then((detail) => {
        if (cancelled || !detail) return;
        setEmirate(detail);
        setInitiatives(
          detail.initiatives.map((init: PublicEmirateInitiative, i: number) => ({
            slug: init.slug,
            title: init.title,
            description: init.subtitle || init.title,
            image: init.coverImage || fallbackInitiativeImages[i % fallbackInitiativeImages.length],
            officialWebsiteUrl: init.officialWebsiteUrl || '',
          })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);

  const displayName = emirate?.title || emirate?.emiratesName || fallbackEntry.title.split('—')[0].trim();
  const emirateImage = emirate?.image || emirateImages[name] || emirateImages['abu-dhabi'];
  const emirateSubtitle = emirate?.description || fallbackEntry.subtitle;
  const orgs = t.raw('orgs') as Org[];

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('emirates'), href: '/emirates' },
            { label: displayName },
          ]} />
        </div>
      </Reveal>

      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="flex flex-col gap-8 max-w-[672px] w-full">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[48px] leading-snug md:leading-[67px] max-w-[640px]">
                  {displayName}
                </h1>
                <p className="font-normal text-[#6B5B57] text-base sm:text-lg md:text-[22px] leading-relaxed md:leading-[32px] max-w-[640px]">
                  {emirateSubtitle}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Link href="/initiatives" className="flex h-[56px] sm:h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors">
                    {t('browseInitiatives')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-[640px]">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
                  <Image src={emirateImage} alt={displayName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" priority unoptimized />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white rounded-[24px] border border-[#E8CFC1] p-8"
            style={{ boxShadow: '0px 4px 6px -4px #0000001A, 0px 10px 15px -3px #0000001A' }}
          >
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">
                {t('availableInitiatives')}
              </span>
              <p className="text-sm text-[#6B5B57]">
                {t('availableText')}
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {initiatives.map((card, i) => (
                <motion.div
                  key={`${card.slug || card.title}-${i}`}
                  variants={itemVariants}
                  className="flex flex-col w-full rounded-[24px] border border-[#E8CFC1] bg-white"
                  style={{ boxShadow: '0px 4px 6px -4px #0000001A, 0px 10px 15px -3px #0000001A' }}
                >
                  <div className="relative w-full h-[200px] sm:h-[224px] rounded-t-[24px] overflow-hidden">
                    <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" unoptimized />
                  </div>
                  <div className="flex flex-col p-5 gap-[28px]">
                    <div className="flex flex-col gap-[14px]">
                      <span className="text-lg font-bold leading-6 text-[#781E36]">
                        {card.title}
                      </span>
                      <p className="text-sm leading-5 text-[#6B5B57]">
                        {card.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[16px] rounded-[16px] border border-[#E8CFC1] bg-[#FAEDE6] p-5">
                      <div className="flex flex-col gap-[14px]">
                        <div className="flex items-center gap-2">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#781E36" /></svg>
                          <span className="text-sm font-semibold leading-5 text-[#781E36]">{t('eligibility')}</span>
                        </div>
                        <p className="text-sm leading-5 text-[#6B5B57]">
                          {t('eligibilityText')}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[14px]">
                        <div className="flex items-center gap-2">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#781E36" /></svg>
                          <span className="text-sm font-semibold leading-5 text-[#781E36]">{t('keyBenefits')}</span>
                        </div>
                        <p className="text-sm leading-5 text-[#6B5B57]">
                          {t('benefitsText')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {card.slug ? (
                        <Link href={`/initiatives/${card.slug}`} className="flex-1 h-[48px] rounded-[12px] bg-[#781E36] text-white text-sm font-bold hover:bg-[#B83A4A] transition-colors items-center justify-center inline-flex">{t('viewDetails')}</Link>
                      ) : (
                        <button type="button" className="flex-1 h-[48px] rounded-[12px] bg-[#781E36] text-white text-sm font-bold hover:bg-[#B83A4A] transition-colors">{t('viewDetails')}</button>
                      )}
                      {card.officialWebsiteUrl ? (
                        <a href={card.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 h-[48px] rounded-[12px] border border-[#E8CFC1] text-[#781E36] text-sm font-bold bg-white hover:border-[#781E36] transition-colors inline-flex items-center justify-center">{t('officialWebsite')}</a>
                      ) : (
                        <button type="button" className="flex-1 h-[48px] rounded-[12px] border border-[#E8CFC1] text-[#781E36] text-sm font-bold bg-white hover:border-[#781E36] transition-colors">{t('officialWebsite')}</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white pt-[48px] pb-[48px] px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">
                {t('featuredOrgs')}
              </span>
              <p className="text-sm text-[#6B5B57]">
                {t('featuredOrgsText')}
              </p>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {orgs.map((org, i) => {
                const isSelected = selectedOrg === org.label;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className={`flex flex-col items-center justify-center gap-3 w-full min-h-[200px] rounded-[24px] bg-white cursor-pointer transition-all px-6 py-8 ${isSelected ? 'border-2 border-[#781E36]' : 'border border-[#E8CFC1]'}`}
                    style={{ boxShadow: isSelected ? '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' : 'none' }}
                    onClick={() => setSelectedOrg(isSelected ? null : org.label)}
                  >
                    <div className={`flex items-center justify-center h-[56px] w-[56px] rounded-[16px] transition-colors ${isSelected ? 'bg-[#781E36]' : 'bg-[#FAEDE6]'}`}>
                      <span className="text-2xl">{orgIcons[i]}</span>
                    </div>
                    <span className="text-center text-sm font-extrabold leading-[19.25px] text-[#781E36]">{org.label}</span>
                    <span className="text-center text-xs text-[#6B5B57]">{org.subtitle}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.35} direction="up">
        <div className="w-full pb-[80px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div
              className="relative flex h-auto min-h-[464px] flex-col items-center justify-center overflow-hidden rounded-[40px] px-6 py-[80px] text-center text-white md:px-[80px]"
              style={{ background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center max-w-[848px]">
                <h2 className="max-w-[848px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight pb-[24px]">
                  {t('ctaTitle')}
                </h2>
                <p className="max-w-[672px] text-base md:text-lg text-white/90 leading-relaxed pb-[40px]">
                  {t('ctaText')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="/initiatives" className="flex h-[56px] sm:h-[64px] w-full sm:w-auto sm:min-w-[221px] items-center justify-center gap-2 rounded-full bg-white px-8 font-extrabold text-base sm:text-lg text-[#781E36] hover:bg-[#FAEDE6] transition-colors">
                    {t('ctaExplore')}
                  </Link>
                  <Link href="/consultation" className="flex h-[56px] sm:h-[64px] w-full sm:w-auto sm:min-w-[221px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 font-extrabold text-base sm:text-lg text-white hover:bg-white hover:text-[#781E36] transition-colors">
                    {t('ctaConsultation')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
