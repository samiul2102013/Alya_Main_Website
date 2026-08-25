'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Globe,
  ArrowRight,
  Hourglass,
  AlarmClock,
  BadgeCheck,
} from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  getConsultationBySlug,
  type PublicConsultationDetail,
} from '@/lib/api/consultations';

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

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1280&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
];

const FALLBACK_COUNSELOR =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';

const scheduleIcons = [
  <Calendar key="date" className="h-6 w-6 text-white" />,
  <Clock key="start" className="h-6 w-6 text-white" />,
  <Hourglass key="duration" className="h-6 w-6 text-white" />,
  <AlarmClock key="end" className="h-6 w-6 text-white" />,
  <Globe key="tz" className="h-6 w-6 text-white" />,
];

type ScheduleItem = { label: string; value: string };

export default function ConsultationDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <ConsultationDetailsInner />
    </Suspense>
  );
}

function ConsultationDetailsInner() {
  const t = useTranslations('consultationDetails');
  const tNav = useTranslations('nav');
  const tB = useTranslations('consultation');
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  const [session, setSession] = useState<PublicConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      let detail: PublicConsultationDetail | null = null;
      if (slugParam) {
        detail = await getConsultationBySlug(slugParam);
      }
      if (cancelled) return;
      setSession(detail || null);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slugParam]);

  if (loading) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
        <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen">
        <Reveal delay={0}>
          <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-6 pb-4">
            <Breadcrumb items={[
              { label: tNav('home'), href: '/' },
              { label: tB('breadcrumbParent'), href: '/consultation' },
              { label: t('breadcrumbCurrent') },
            ]} />
          </div>
        </Reveal>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-24 flex flex-col items-center gap-6 text-center">
          <p className="text-base font-normal text-[#6B5B57]">Session not found.</p>
          <Link
            href="/consultation"
            className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors"
          >
            {tB('browseSessions')}
          </Link>
        </div>
      </div>
    );
  }

  const images = (session.gallery && session.gallery.length
    ? session.gallery
    : FALLBACK_IMAGES).slice(0, 4);

  const counselorPhoto = session.counselorPhoto || FALLBACK_COUNSELOR;

  const metaItems: ScheduleItem[] = [
    { label: 'Category', value: session.category || '—' },
    {
      label: 'Format',
      value: session.meetingFormat === 'onsite' ? 'Onsite' : 'Online',
    },
    { label: 'Duration', value: session.duration || '—' },
    {
      label: 'Language',
      value:
        session.language === 'ar' ? 'Arabic' : session.language === 'en' ? 'English' : 'Both',
    },
  ];

  const objectives = session.objectives && session.objectives.length
    ? session.objectives
    : [];
  const learn = session.whatYouWillLearn && session.whatYouWillLearn.length
    ? session.whatYouWillLearn
    : [];
  const attend = session.whoShouldAttend && session.whoShouldAttend.length
    ? session.whoShouldAttend
    : [];

  const scheduleEntries: ScheduleItem[] = [
    { label: 'Date', value: session.date || '—' },
    { label: 'Start Time', value: session.startTime || '—' },
    { label: 'Duration', value: session.duration || '—' },
    { label: 'End Time', value: session.endTime || '—' },
    { label: 'Time Zone', value: session.timeZone || '—' },
  ];

  const descriptionParagraphs = session.description
    ? session.description.split(/\n\n+/).filter(Boolean)
    : [];

  const feeLabel =
    session.isFree ? 'Free' : `AED ${session.fee}`;

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-6 pb-4">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tB('breadcrumbParent'), href: '/consultation' },
            { label: session.sessionTitle },
          ]} />
        </div>
      </Reveal>

      {/* ===================== HERO ===================== */}
      <Reveal delay={0.1} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12 pt-2">
          <div className="flex flex-col lg:flex-row gap-[24px]">
            {/* Left: Big image + small image gallery */}
            <div className="flex flex-col gap-[24px] w-full lg:max-w-[838px]">
              <div className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] lg:h-[618px] rounded-[20px] overflow-hidden bg-gray-200">
                <Image
                  src={images[activeImage]}
                  alt={session.sessionTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 838px"
                  priority
                />
              </div>

              <div className="flex gap-[17px] flex-wrap">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative w-[calc(50%-8.5px)] sm:w-[calc(25%-12.75px)] h-[100px] sm:h-[125px] rounded-[20px] overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-[#781E36]'
                        : 'border-transparent hover:border-[#E8CFC1]'
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="169px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product info + Counselor info */}
            <div className="flex flex-col gap-[24px] w-full lg:max-w-[420px]">
              <motion.div
                className="w-full rounded-[10px] border border-[#E8CFC1] bg-white p-[18px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
              >
                <div className="flex flex-col gap-5 max-w-[384px] mx-auto">
                  <motion.div variants={itemVariants} className="flex items-center gap-[15px]">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6] border border-[#E8CFC1]">
                      <Calendar className="h-5 w-5 text-[#781E36]" />
                    </div>
                    <span className="font-normal text-[#6B5B57] text-base md:text-lg leading-[30px] tracking-[0.1px]">
                      {session.date || '—'}
                    </span>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center gap-[15px]">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6] border border-[#E8CFC1]">
                      <Clock className="h-5 w-5 text-[#781E36]" />
                    </div>
                    <span className="font-normal text-[#6B5B57] text-base md:text-lg leading-[30px] tracking-[0.1px]">
                      {session.startTime}{session.endTime ? ` - ${session.endTime}` : ''}
                      {session.timeZone ? ` (${session.timeZone})` : ''}
                    </span>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center gap-[15px]">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FAEDE6] border border-[#E8CFC1]">
                      <Globe className="h-5 w-5 text-[#781E36]" />
                    </div>
                    <span className="font-normal text-[#6B5B57] text-base md:text-lg leading-[30px] tracking-[0.1px]">
                      {session.meetingFormat === 'onsite' ? 'Onsite' : 'Online via Zoom'}
                    </span>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-[6px] flex-1">
                      <span className="font-medium text-[#B83A4A] text-base md:text-lg leading-[30px] tracking-[0.1px]">
                        {t('sessionFee')}
                      </span>
                      <span className="font-bold text-[#781E36] text-lg md:text-2xl leading-[30px]">
                        {feeLabel}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[6px] flex-1">
                      <span className="font-medium text-[#B83A4A] text-base md:text-lg leading-[30px] tracking-[0.1px]">
                        {t('seatsLeft')}
                      </span>
                      <span className="font-bold text-[#781E36] text-lg md:text-2xl leading-[30px]">
                        {session.maxParticipants
                          ? `${session.seatsLeft ?? session.maxParticipants} / ${session.maxParticipants}`
                          : 'Unlimited'}
                      </span>
                    </div>
                  </motion.div>

                  {session.showBooking && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href={`/consultation/book?slug=${session.slug}`}
                        className="flex items-center justify-center gap-2 w-full h-[60px] rounded-[10px] bg-[#781E36] px-[10px] text-base font-bold text-white hover:bg-[#B83A4A] transition-colors"
                      >
                        {t('bookNow')}
                        <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Counselor info */}
              {session.showDoctor && (session.counselor || session.counselorTitle) && (
                <motion.div
                  className="w-full rounded-[10px] border border-[#E8CFC1] bg-white p-[24px]"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <div className="flex flex-col gap-5 max-w-[373px] mx-auto">
                    <motion.div variants={itemVariants} className="flex items-center gap-[25px]">
                      <div className="relative h-[74px] w-[74px] shrink-0 rounded-full overflow-hidden border-2 border-[#E8CFC1]">
                        <Image
                          src={counselorPhoto}
                          alt={session.counselor}
                          fill
                          className="object-cover"
                          sizes="74px"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#781E36]">{session.counselor || 'Counselor'}</span>
                        <span className="text-sm font-medium text-[#6B5B57]">{session.counselorTitle}</span>
                      </div>
                    </motion.div>
                    {session.counselorBio && (
                      <motion.p variants={itemVariants} className="max-w-[373px] text-[#6B5B57] text-sm md:text-base leading-relaxed">
                        {session.counselorBio}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===================== META INFO ===================== */}
      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="h-auto rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-30px' }}
            >
              {metaItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center w-full max-w-[280px] mx-auto h-auto min-h-[82px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px] gap-[10px]"
                >
                  <span className="text-center text-sm md:text-base leading-[28px] text-[#989898]">
                    {item.label}
                  </span>
                  <span className="text-center text-sm md:text-base font-semibold leading-[28px] text-[#781E36]">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>

      {/* ===================== ABOUT THE SESSION ===================== */}
      {descriptionParagraphs.length > 0 && (
        <Reveal delay={0.25} direction="up">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
            <div className="h-auto rounded-[12px] bg-white p-[10px]">
              <div className="flex flex-col gap-4 w-full max-w-[1237px] mx-auto">
                <SectionHeader>{t('aboutTitle')}</SectionHeader>
                {descriptionParagraphs.map((p, i) => (
                  <p key={i} className="text-[#757575] text-sm md:text-base leading-[30px] tracking-[0.1px] max-w-[1206px]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ===================== SESSION OBJECTIVES ===================== */}
      {objectives.length > 0 && (
        <Reveal delay={0.3} direction="up">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
            <div className="rounded-[12px] bg-white p-[10px]">
              <div className="max-w-[1260px] mx-auto">
                <SectionHeader>{t('objectives')}</SectionHeader>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-50px' }}
                >
                  {objectives.map((text, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-center w-full max-w-[400px] h-auto min-h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]"
                    >
                      <span className="text-sm md:text-base font-semibold leading-[28px] text-[#781E36]">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ===================== WHAT YOU WILL LEARN ===================== */}
      {learn.length > 0 && (
        <Reveal delay={0.35} direction="up">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
            <div className="rounded-[12px] bg-white p-[10px]">
              <div className="max-w-[1260px] mx-auto">
                <SectionHeader>{t('learnTitle')}</SectionHeader>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-50px' }}
                >
                  {learn.map((text, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-center w-full max-w-[400px] h-auto min-h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]"
                    >
                      <span className="text-sm md:text-base font-semibold leading-[28px] text-[#781E36]">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ===================== WHO SHOULD ATTEND ===================== */}
      {attend.length > 0 && (
        <Reveal delay={0.4} direction="up">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
            <div className="rounded-[12px] bg-white p-[10px]">
              <div className="max-w-[1260px] mx-auto">
                <SectionHeader>{t('attendTitle')}</SectionHeader>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-50px' }}
                >
                  {attend.map((text, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-center gap-[10px] w-full max-w-[400px] h-auto min-h-[55px] rounded-[12px] bg-[#781E36] p-[10px]"
                    >
                      <BadgeCheck className="h-5 w-5 shrink-0 text-[#E8CFC1]" />
                      <span className="text-sm md:text-base font-semibold leading-[28px] text-white">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ===================== SESSION SCHEDULE ===================== */}
      {session.showSchedule && (
        <Reveal delay={0.45} direction="up">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
            <div className="rounded-[12px] bg-white p-[10px]">
              <div className="max-w-[1260px] mx-auto">
                <SectionHeader>{t('scheduleTitle')}</SectionHeader>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-50px' }}
                >
                  {scheduleEntries.slice(0, 4).map((item, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-center gap-[10px] w-full max-w-[590px] h-auto min-h-[96px] rounded-[12px] bg-[#E8CFC1] p-[10px]"
                    >
                      <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[12px] bg-[#781E36]">
                        {scheduleIcons[i]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-normal text-[#6B5B57] leading-[28px]">
                          {item.label}
                        </span>
                        <span className="text-base md:text-lg font-bold text-[#781E36] leading-[28px]">
                          {item.value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {scheduleEntries[4] && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-[10px] w-full max-w-[1185px] h-auto min-h-[96px] rounded-[12px] bg-[#E8CFC1] p-[10px] mt-[10px] mx-auto"
                  >
                    <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[12px] bg-[#781E36]">
                      {scheduleIcons[4]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-normal text-[#6B5B57] leading-[28px]">
                        {scheduleEntries[4].label}
                      </span>
                      <span className="text-base md:text-lg font-bold text-[#781E36] leading-[28px]">
                        {scheduleEntries[4].value}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}