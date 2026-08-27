'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Search, ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { getPublishedEmirates, type PublicEmirate } from '@/lib/api/emirates';
import { EMIRATES_IMAGES, EMIRATES_HERO_IMAGE } from '@/lib/image-pools';

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

interface EmirateItem {
  name: string;
  description: string;
  count: string;
}

interface Org {
  label: string;
  subtitle: string;
}

const orgIcons = ['💒', '🏗️', '👪', '🌟'];

const fallbackImages = EMIRATES_IMAGES;

interface DisplayItem {
  slug: string;
  image: string;
  name: string;
  description: string;
  count: string;
}

function useEmiratesData(fallback: EmirateItem[]): DisplayItem[] {
  const fallbackRef = useRef(fallback);

  const [items, setItems] = useState<DisplayItem[]>(() =>
    fallback.map((item, i) => ({
      slug: `emirate-${i}`,
      image: fallbackImages[i % fallbackImages.length],
      name: item.name,
      description: item.description,
      count: item.count,
    })),
  );

  useEffect(() => {
    fallbackRef.current = fallback;
  });

  useEffect(() => {
    let cancelled = false;
    const fb = fallbackRef.current;
    getPublishedEmirates()
      .then((list: PublicEmirate[]) => {
        if (cancelled || !list.length) return;
        setItems(
          list.map((emi, i) => ({
            slug: emi.slug,
            image: emi.image || fallbackImages[i % fallbackImages.length],
            name: emi.title || emi.emiratesName,
            description: emi.description || fb[i % fb.length]?.description || '',
            count: emi.centerCount || fb[i % fb.length]?.count || '',
          })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}

export default function EmiratesPage() {
  const t = useTranslations('emiratesPage');
  const tNav = useTranslations('nav');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const list = t.raw('list') as EmirateItem[];
  const orgs = t.raw('orgs') as Org[];
  const items = useEmiratesData(list);

  const regionOptions = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  const filteredItems = items.filter((item) => {
    const matchSearch = !searchText.trim() || item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchRegion = !filterRegion || item.name === filterRegion;
    return matchSearch && matchRegion;
  });

  function handleResetFilters() {
    setSearchText('');
    setFilterRegion('');
    setOpenDropdown(null);
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('emirates') },
          ]} />
        </div>
      </Reveal>

      <Reveal delay={0.1} direction="up">
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex flex-col gap-8 max-w-[672px] w-full">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[48px] leading-snug md:leading-[67px]">
                  {t('title')}
                </h1>
                <p className="font-normal text-[#6B5B57] text-base sm:text-lg md:text-[20px] md:leading-[34px]">
                  {t('description')}
                </p>
              </div>

              <div className="w-full max-w-[640px]">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
                  <Image
                    src={EMIRATES_HERO_IMAGE}
                    alt={t('title')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#781E36]/15 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-col gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-[#781E36]">
                {t('exploreTitle')}
              </span>
              <p className="text-sm text-[#6B5B57]">
                {t('exploreText')}
              </p>
            </div>

            <div className="w-full rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[10px] w-full h-[61px] rounded-[12px] border border-[#E8CFC1] bg-white px-[10px]">
                <Search className="h-5 w-5 text-[#989898] shrink-0" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full h-full bg-transparent text-sm font-normal text-gray-700 outline-none placeholder:text-[#989898]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                    className={`flex items-center justify-between w-full h-[48px] rounded-[10px] border px-[10px] cursor-pointer transition-colors bg-white ${
                      filterRegion || openDropdown === 'region'
                        ? 'border-[#781E36]'
                        : 'border-[#E8CFC1] hover:border-[#781E36]'
                    }`}
                  >
                    <span className={`text-sm truncate ${filterRegion ? 'font-semibold text-[#781E36]' : 'font-medium text-[#6B5B57]'}`}>
                      {filterRegion || 'All Emirates'}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#989898] transition-transform duration-200 ${openDropdown === 'region' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === 'region' && (
                    <div className="absolute top-full left-0 mt-1 w-full rounded-[10px] border border-[#E8CFC1] bg-white shadow-lg z-20 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => { setFilterRegion(''); setOpenDropdown(null); }}
                        className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                      >
                        All Emirates
                      </button>
                      {regionOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => { setFilterRegion(opt); setOpenDropdown(null); }}
                          className="w-full px-[10px] py-2 text-left text-sm font-medium text-[#6B5B57] hover:bg-[#FAEDE6] hover:text-[#781E36] transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-[10px] w-full">
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="w-full h-[52px] rounded-[12px] bg-[#781E36] px-6 py-3 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors sm:flex-1"
                >
                  {t('search')}
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto h-[52px] rounded-[12px] bg-[#FAEDE6] px-6 py-3 text-sm font-bold text-[#781E36] border border-[#E8CFC1] hover:bg-[#F3D9CE] transition-colors"
                >
                  {t('reset')}
                </button>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              {filteredItems.map((item) => (
                <motion.div key={item.slug} variants={itemVariants} className="flex flex-col mx-auto w-full max-w-[400px] min-h-[370px] rounded-[24px] border border-[#E8CFC1] bg-white overflow-hidden">
                  <div className="relative w-full h-[160px] shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" unoptimized />
                  </div>
                  <div className="flex flex-col flex-1 p-4 gap-3">
                    <span className="text-sm font-bold text-[#781E36]">
                      {item.name}
                    </span>
                    <p className="text-xs leading-4 text-[#6B5B57]">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#E8CFC1]">
                      <span className="rounded-full bg-[#781E36] px-3 py-0.5 text-xs font-bold text-white">
                        {item.count}
                      </span>
                      <Link href={`/emirates/${item.slug}`} className="flex items-center gap-1 text-xs font-bold text-[#781E36] hover:text-[#B83A4A] transition-colors">
                        {t('readMore')}
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="text-base font-normal text-[#6B5B57]">No emirates found.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-[52px] rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
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
                    style={{
                      boxShadow: isSelected ? '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' : 'none',
                    }}
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
              style={{
                background: 'linear-gradient(90deg, #781E36 0%, #B83A4A 100%)',
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
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
