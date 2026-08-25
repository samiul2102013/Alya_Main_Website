'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { getBookingByReference, type PublicBooking } from '@/lib/api/consultations';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type FieldItem = { label: string; value: string };

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <ConfirmationPageInner />
    </Suspense>
  );
}

function ConfirmationPageInner() {
  const t = useTranslations('confirmation');
  const tNav = useTranslations('nav');
  const tB = useTranslations('consultation');
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');

  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!refParam) {
        if (!cancelled) setLoaded(true);
        return;
      }
      const b = await getBookingByReference(refParam);
      if (cancelled) return;
      setBooking(b);
      setLoaded(true);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [refParam]);

  if (!loaded) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
        <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
      </div>
    );
  }

  const snap = booking?.sessionSnapshot;

  const bookingFields: FieldItem[] = booking
    ? [
        { label: t.raw('bookingFields')[0].label, value: booking.reference },
        {
          label: t.raw('bookingFields')[1].label,
          value: booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '',
        },
        {
          label: t.raw('bookingFields')[2].label,
          value: booking.status === 'confirmed' ? 'Confirmed' : booking.status,
        },
        {
          label: t.raw('bookingFields')[3].label,
          value: booking.paymentSuccess ? 'Paid' : 'Pending',
        },
        { label: t.raw('bookingFields')[4].label, value: booking.fullName },
        { label: t.raw('bookingFields')[5].label, value: booking.email },
        { label: t.raw('bookingFields')[6].label, value: booking.contactNumber },
        { label: t.raw('bookingFields')[7].label, value: booking.userType === 'individual' ? 'Individual' : booking.userType },
      ]
    : (t.raw('bookingFields') as FieldItem[]);

  const sessionFields: FieldItem[] = snap
    ? [
        { label: t.raw('sessionFields')[0].label, value: snap.sessionTitle || '' },
        { label: t.raw('sessionFields')[1].label, value: snap.counselor || '' },
        { label: t.raw('sessionFields')[2].label, value: '' },
        { label: t.raw('sessionFields')[3].label, value: '' },
        { label: t.raw('sessionFields')[4].label, value: `${snap.date || ''}${snap.startTime ? ` - ${snap.startTime}` : ''}` },
        { label: t.raw('sessionFields')[5].label, value: snap.duration || '' },
        { label: t.raw('sessionFields')[6].label, value: '' },
        { label: t.raw('sessionFields')[7].label, value: snap.meetingFormat === 'onsite' ? 'Onsite' : 'Online via Zoom' },
        {
          label: t.raw('sessionFields')[8].label,
          value: snap.meetingFormat === 'onsite' ? 'Onsite' : 'Online',
        },
      ]
    : (t.raw('sessionFields') as FieldItem[]);

  const amount = Number(booking?.amount) || 0;
  const fee = Number(snap ? booking?.amount : 0) || 0;

  const importantNotes = t.raw('notes') as string[];

  return (
    <div className="bg-[#FAEDE6] min-h-screen">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: tB('breadcrumbParent'), href: '/consultation' },
            { label: t('breadcrumbCurrent') },
          ]} />
        </div>
      </Reveal>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
        <Reveal delay={0.1} direction="up">
          <div className="rounded-[12px] bg-white p-6">
            <div className="flex flex-col items-center gap-[50px] w-full">

              <div className="flex flex-col items-center gap-[50px] w-full max-w-[1260px] pt-12">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="flex items-center justify-center h-[100px] w-[100px] rounded-full bg-[#34C759]"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  >
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <div className="flex flex-col items-center gap-[26px] w-full max-w-[1260px]">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="text-center text-3xl sm:text-4xl md:text-5xl md:leading-[75px] font-bold text-[#781E36]"
                  >
                    {t('title')}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                    className="text-center max-w-[759px] text-sm md:text-base lg:text-lg leading-6 md:leading-[24px] tracking-[0.1px] text-[#6B5B57]"
                  >
                    {t('subtitle')}
                  </motion.p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1260px]">
                <Reveal delay={0.2} direction="up" className="w-full lg:max-w-[570px]">
                  <motion.div
                    className="flex flex-col w-full rounded-[12px] border border-[#E8CFC1] bg-white p-6 gap-4"
                    whileHover={{ boxShadow: '0 8px 30px rgba(120,30,54,0.08)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pb-[10px] border-b border-[#E8CFC1]">
                      <span className="text-xl md:text-[32px] font-bold leading-[32px] md:leading-[48px] text-[#781E36]">
                        {t('bookingInfo')}
                      </span>
                    </div>
                    <motion.div
                      className="flex flex-col"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, margin: '-30px' }}
                    >
                      {bookingFields.map((field, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="flex flex-wrap items-center justify-between gap-2 w-full py-3 px-1"
                        >
                          <span className="text-sm md:text-base leading-[24px] text-[#6B5B57]">
                            {field.label}
                          </span>
                          <span className="text-sm md:text-base font-semibold leading-[24px] text-[#781E36]">
                            {field.value}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </Reveal>

                <Reveal delay={0.3} direction="up" className="w-full lg:max-w-[570px]">
                  <motion.div
                    className="flex flex-col w-full rounded-[12px] border border-[#E8CFC1] bg-white p-6 gap-4"
                    whileHover={{ boxShadow: '0 8px 30px rgba(120,30,54,0.08)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pb-[10px] border-b border-[#E8CFC1]">
                      <span className="text-xl md:text-[32px] font-bold leading-[32px] md:leading-[48px] text-[#781E36]">
                        {t('sessionDetails')}
                      </span>
                    </div>
                    <motion.div
                      className="flex flex-col"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, margin: '-30px' }}
                    >
                      {sessionFields.map((field, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="flex flex-wrap items-center justify-between gap-2 w-full py-3 px-1"
                        >
                          <span className="text-sm md:text-base leading-[24px] text-[#6B5B57]">
                            {field.label}
                          </span>
                          <span className="text-sm md:text-base font-semibold leading-[24px] text-[#781E36]">
                            {field.value}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </Reveal>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1260px]">
                <Reveal delay={0.35} direction="up" className="w-full lg:max-w-[600px]">
                  <motion.div
                    className="flex flex-col w-full min-h-[397px] rounded-[12px] border border-[#E8CFC1] bg-white p-6 gap-4"
                    whileHover={{ boxShadow: '0 8px 30px rgba(120,30,54,0.08)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pb-[10px] border-b border-[#E8CFC1]">
                      <span className="text-xl md:text-2xl font-bold leading-[32px] text-[#781E36]">
                        {t('paymentSummary')}
                      </span>
                    </div>
                    <motion.div
                      className="flex flex-col gap-2"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, margin: '-30px' }}
                    >
                      {booking && Number(booking.amount) <= 0 ? (
                        <motion.div variants={itemVariants} className="flex items-center justify-between w-full mt-2">
                          <span className="text-base md:text-xl font-normal text-[#6B5B57]">
                            {t('totalPaid')}
                          </span>
                          <span className="text-base md:text-xl font-bold text-[#781E36]">
                            Free
                          </span>
                        </motion.div>
                      ) : (
                        <>
                          <motion.div variants={itemVariants} className="flex items-center justify-between w-full mt-2">
                            <span className="text-base md:text-xl font-normal text-[#6B5B57]">
                              {t('sessionFee')}
                            </span>
                            <span className="text-base md:text-xl font-medium text-[#781E36]">
                              {fee} AED
                            </span>
                          </motion.div>
                          <motion.hr variants={itemVariants} className="border-t border-[#E8CFC1] w-full my-2" />
                          <motion.div variants={itemVariants} className="flex items-center justify-between w-full">
                            <span className="font-bold text-lg md:text-2xl font-bold text-[#781E36]">
                              {t('totalPaid')}
                            </span>
                            <span className="font-bold text-lg md:text-2xl font-bold text-[#781E36]">
                              {amount} AED
                            </span>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                </Reveal>

                <Reveal delay={0.45} direction="up" className="w-full lg:max-w-[600px]">
                  <motion.div
                    className="flex flex-col w-full min-h-[397px] rounded-[12px] border border-[#E8CFC1] bg-white p-6 gap-4"
                    whileHover={{ boxShadow: '0 8px 30px rgba(120,30,54,0.08)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pb-[10px] border-b border-[#E8CFC1]">
                      <span className="text-xl md:text-2xl font-bold leading-[32px] text-[#781E36]">
                        {t('importantNote')}
                      </span>
                    </div>
                    <motion.ul
                      className="flex flex-col gap-4 mt-2 list-disc pl-5"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, margin: '-30px' }}
                    >
                      {importantNotes.map((note, i) => (
                        <motion.li
                          key={i}
                          variants={itemVariants}
                          className="text-sm md:text-base font-normal text-[#6B5B57]"
                        >
                          {note}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </Reveal>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 w-full max-w-[600px] mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                {booking && (
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/consultation?search=${encodeURIComponent(booking.sessionSnapshot?.sessionTitle ?? '')}`}
                      className="flex items-center justify-center w-full h-[60px] rounded-[10px] border-2 border-[#781E36] bg-transparent px-[10px] text-base font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors"
                    >
                      {t('return')}
                    </Link>
                  </motion.div>
                )}
                {!booking && (
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/consultation"
                      className="flex items-center justify-center w-full h-[60px] rounded-[10px] bg-[#781E36] px-[10px] text-base font-bold text-white hover:bg-[#B83A4A] transition-colors"
                    >
                      {t('return')}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}