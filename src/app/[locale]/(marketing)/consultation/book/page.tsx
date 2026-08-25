'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  PaymentElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { User, FileText, Clock, Globe, Calendar, MapPin, ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { getConsultationBySlug, createBooking, type PublicConsultationDetail } from '@/lib/api/consultations';
import {
  createPaymentIntent,
  confirmBookingPayment,
  type PaymentIntentResult,
} from '@/lib/api/payments';

function getStripePromise() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === 'pk_test_xxx') return null;
  return loadStripe(key);
}

const stripePromise = getStripePromise();

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

type SummaryItem = { label: string; value: string };

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAEDE6] min-h-screen flex items-center justify-center">
          <p className="text-base font-normal text-[#6B5B57]">Loading...</p>
        </div>
      }
    >
      <BookingPageInner />
    </Suspense>
  );
}

function StripeCheckout({
  onSuccess,
  onBack,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}) {
  const t = useTranslations('booking');
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setErrorMessage(null);
    setProcessing(true);
    try {
      const result = (await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
      })) as { error?: { message?: string } | null; paymentIntent?: { id: string; status: string } | null };
      if (result.error) {
        setErrorMessage(result.error.message ?? 'Payment could not be completed.');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch {
      setErrorMessage('Payment could not be completed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-[18px] w-full max-w-[384px] mt-2">
      <div className="flex items-center justify-between w-full">
        <span className="text-lg md:text-2xl font-bold leading-[30px] tracking-[0.1px] text-[#781E36]">
          {t('paymentMethod')}
        </span>
      </div>

      <div className="rounded-[12px] border border-[#E8CFC1] bg-white p-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <p className="text-xs leading-[18px] text-[#989898]">{t('securePayment')}</p>

      {errorMessage && (
        <div className="w-full rounded-[10px] border border-[#B83A4A] bg-[#B83A4A]/5 px-4 py-3">
          <p className="text-sm font-medium text-[#B83A4A]">{errorMessage}</p>
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          disabled={!stripe || !elements || processing}
          onClick={handlePay}
          className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#781E36] px-[10px] text-base font-bold text-white hover:bg-[#B83A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {processing ? t('processingPayment') : t('payNow')}
        </button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          disabled={processing}
          onClick={onBack}
          className="w-full h-[60px] rounded-[10px] border border-[#E8CFC1] bg-white px-[10px] text-base font-semibold text-[#6B5B57] hover:border-[#781E36] transition-colors disabled:opacity-60"
        >
          {t('backToSession')}
        </button>
      </motion.div>
    </div>
  );
}

function BookingPageInner() {
  const t = useTranslations('booking');
  const tNav = useTranslations('nav');
  const tB = useTranslations('consultation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugParam = searchParams.get('slug');

  const [session, setSession] = useState<PublicConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    preferredLanguage: '',
  });
  const [agree, setAgree] = useState(false);

  const [paymentSetup, setPaymentSetup] = useState<PaymentIntentResult | null>(null);

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

  const countries = t.raw('countries') as string[];
  const languages = t.raw('languages') as string[];

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
          <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
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

  const fee = Number(session.fee) || 0;
  const processingFee = Number(session.processingFee) || 0;
  const discount = Number(session.discount) || 0;
  const total = session.isFree ? 0 : Math.max(fee + processingFee - discount, 0);

  const summaryLabels = t.raw('summary') as { label: string; value: string }[];

  const summary: SummaryItem[] = [
    { label: summaryLabels[0]?.label ?? '', value: session.counselor || '—' },
    { label: summaryLabels[1]?.label ?? '', value: session.sessionTitle },
    { label: summaryLabels[2]?.label ?? '', value: session.duration || `${session.startTime} - ${session.endTime}` },
    {
      label: summaryLabels[3]?.label ?? '',
      value: session.language === 'ar' ? 'Arabic' : session.language === 'en' ? 'English' : 'Both',
    },
    { label: summaryLabels[4]?.label ?? '', value: session.date || '—' },
    {
      label: summaryLabels[5]?.label ?? '',
      value: session.meetingFormat === 'onsite' ? 'Onsite' : 'Online',
    },
  ];

  const summaryIcons = [User, FileText, Clock, Globe, Calendar, MapPin];

  function validateForm(): string | null {
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.country) {
      return 'Please fill in all required fields.';
    }
    if (!session?.isFree && !agree) {
      return 'Please agree to the terms and conditions.';
    }
    return null;
  }

  async function handleFreeSubmit() {
    setErrorMessage(null);
    if (!session) return;
    setSubmitting(true);
    try {
      const booking = await createBooking({
        consultationId: session.id,
        fullName: form.fullName.trim(),
        contactNumber: form.phone.trim(),
        email: form.email.trim(),
        userType: 'individual',
        paymentMethod: 'card',
      });
      router.push(`/consultation/confirmation?ref=${booking.reference}`);
    } catch (e) {
      const err = e as Error & { details?: Record<string, string[]> };
      const firstDetail = err.details
        ? Object.values(err.details)[0]?.[0]
        : undefined;
      setErrorMessage(firstDetail || err.message || 'Failed to submit your booking. Please try again.');
      setSubmitting(false);
    }
  }

  async function handleStartPayment() {
    setErrorMessage(null);
    if (!session) return;
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setSubmitting(true);
    try {
      if (!stripePromise) {
        setErrorMessage(
          t('paymentNotConfigured') || 'Online payment is not available right now. Please contact support.',
        );
        return;
      }
      const result = await createPaymentIntent({
        consultationId: session.id,
        fullName: form.fullName.trim(),
        contactNumber: form.phone.trim(),
        email: form.email.trim(),
        userType: 'individual',
      });
      setPaymentSetup(result);
    } catch (e) {
      const err = e as Error & { details?: Record<string, string[]> };
      const firstDetail = err.details
        ? Object.values(err.details)[0]?.[0]
        : undefined;
      setErrorMessage(firstDetail || err.message || 'Could not initialize payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaymentSuccess(paymentIntentId: string) {
    try {
      const booking = await confirmBookingPayment(paymentIntentId);
      router.push(`/consultation/confirmation?ref=${booking.reference}`);
    } catch (e) {
      const err = e as Error & { details?: Record<string, string[]> };
      const firstDetail = err.details
        ? Object.values(err.details)[0]?.[0]
        : undefined;
      setErrorMessage(firstDetail || err.message || 'Payment received, but confirming your booking failed. Please contact support.');
    }
  }

  const elementsOptions: StripeElementsOptions = paymentSetup
    ? { clientSecret: paymentSetup.clientSecret }
    : {};

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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-[50px] w-full lg:max-w-[829px]">

            <Reveal delay={0.1} direction="up">
              <div>
                <h2 className="text-[#781E36] text-2xl md:text-[32px] font-semibold leading-[24px] md:leading-[36px] tracking-[0.1px]">
                  {session.sessionTitle}
                </h2>
                <p className="text-[#6B5B57] mt-4 text-sm md:text-base leading-6">
                  {t('subtitle')}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2} direction="up">
              <div className="rounded-[12px] border border-[#E8CFC1] bg-white p-6">
                <div className="pb-[10px] border-b border-[#E8CFC1]">
                  <span className="text-2xl md:text-[32px] font-semibold leading-[24px] md:leading-[36px] tracking-[0.1px] text-[#781E36]">
                    {t('sessionSummary')}
                  </span>
                </div>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mt-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  {summary.map((item, i) => {
                    const Icon = summaryIcons[i % summaryIcons.length];
                    return (
                      <motion.div key={i} variants={itemVariants} className="flex items-center gap-[12px] w-full max-w-[400px]">
                        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[30px] bg-[#E8CFC1] p-[7px]">
                          <Icon className="h-5 w-5 text-[#781E36]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm md:text-base leading-[28px] text-[#989898]">
                            {item.label}
                          </span>
                          <span className="text-sm md:text-[14.77px] font-semibold leading-[28px] text-[#781E36]">
                            {item.value}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.3} direction="up">
              <div className="rounded-[12px] border border-[#E8CFC1] bg-white p-6">
                <div className="pb-[10px] border-b border-[#E8CFC1]">
                  <span className="text-2xl md:text-[32px] font-semibold leading-[24px] md:leading-[36px] tracking-[0.1px] text-[#781E36]">
                    {t('personalInfo')}
                  </span>
                </div>
                <motion.div
                  className="mt-6 flex flex-col gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[17px] md:text-[19px] font-medium leading-[140%] text-[#781E36]">
                        {t('fullName')} <span className="text-[#B83A4A]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        placeholder={t('fullNamePlaceholder')}
                        className="w-full h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 text-[#6B5B57] outline-none focus:border-[#781E36] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(120,30,54,0.15)]"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[17px] md:text-[19px] font-medium leading-[140%] text-[#781E36]">
                        {t('phone')} <span className="text-[#B83A4A]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder={t('phonePlaceholder')}
                        className="w-full h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 text-[#6B5B57] outline-none focus:border-[#781E36] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(120,30,54,0.15)]"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col gap-2 w-full">
                    <label className="text-[17px] md:text-[19px] font-medium leading-[140%] text-[#781E36]">
                      {t('email')} <span className="text-[#B83A4A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder={t('emailPlaceholder')}
                      className="w-full h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 text-[#6B5B57] outline-none focus:border-[#781E36] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(120,30,54,0.15)]"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[17px] md:text-[19px] font-medium leading-[140%] text-[#781E36]">
                        {t('country')} <span className="text-[#B83A4A]">*</span>
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.country}
                          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                          className="w-full h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 text-[#6B5B57] appearance-none outline-none focus:border-[#781E36] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(120,30,54,0.15)]"
                        >
                          <option value="">{t('selectCountry')}</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5B57] pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[17px] md:text-[19px] font-medium leading-[140%] text-[#781E36]">
                        {t('preferredLanguage')}
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.preferredLanguage}
                          onChange={(e) => setForm((f) => ({ ...f, preferredLanguage: e.target.value }))}
                          className="w-full h-[55px] rounded-[12px] border border-[#E8CFC1] bg-white px-4 text-[#6B5B57] appearance-none outline-none focus:border-[#781E36] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(120,30,54,0.15)]"
                        >
                          <option value="">{t('selectLanguage')}</option>
                          {languages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5B57] pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.35} direction="right">
            <motion.div
              className="w-full max-w-[420px] h-auto rounded-[10px] border border-[#E8CFC1] bg-white p-[18px]"
              whileHover={{ boxShadow: '0 8px 30px rgba(120,30,54,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex flex-col gap-[16px] max-w-[384px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
              >
                <motion.div variants={itemVariants}>
                  <span className="text-[#781E36] text-xl md:text-2xl font-bold leading-[30px] tracking-[0.1px]">
                    {t('bookingSummary')}
                  </span>
                </motion.div>

                {session.isFree ? (
                  <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-[384px] h-auto min-h-[30px]">
                    <span className="text-lg md:text-2xl font-normal leading-[30px] tracking-[0.1px] text-[#6B5B57]">
                      {t('total')}
                    </span>
                    <span className="text-lg md:text-2xl font-bold leading-[30px] tracking-[0.1px] text-[#781E36]">
                      Free
                    </span>
                  </motion.div>
                ) : (
                  <>
                    <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-[384px] h-auto min-h-[30px]">
                      <span className="text-lg md:text-2xl font-normal leading-[30px] tracking-[0.1px] text-[#6B5B57]">
                        {t('sessionFee')}
                      </span>
                      <span className="text-lg md:text-2xl font-medium leading-[30px] tracking-[0.1px] text-[#781E36]">
                        {fee} AED
                      </span>
                    </motion.div>

                    {processingFee > 0 && (
                      <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-[384px] h-auto min-h-[30px]">
                        <span className="text-lg md:text-2xl font-normal leading-[30px] tracking-[0.1px] text-[#6B5B57]">
                          {t('processingFee')}
                        </span>
                        <span className="text-lg md:text-2xl font-medium leading-[30px] tracking-[0.1px] text-[#781E36]">
                          {processingFee} AED
                        </span>
                      </motion.div>
                    )}

                    {discount > 0 && (
                      <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-[384px] h-auto min-h-[30px]">
                        <span className="text-lg md:text-2xl font-normal leading-[30px] tracking-[0.1px] text-[#6B5B57]">
                          {t('discount')}
                        </span>
                        <span className="text-lg md:text-2xl font-medium leading-[30px] tracking-[0.1px] text-[#B83A4A]">
                          -{discount} AED
                        </span>
                      </motion.div>
                    )}

                    <motion.hr variants={itemVariants} className="border-t border-[#E8CFC1] w-full" />

                    <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-[384px] h-auto min-h-[30px]">
                      <span className="text-lg md:text-2xl font-bold leading-[30px] tracking-[0.1px] text-[#781E36]">
                        {t('total')}
                      </span>
                      <span className="text-lg md:text-2xl font-bold leading-[30px] tracking-[0.1px] text-[#781E36]">
                        {total} AED
                      </span>
                    </motion.div>
                  </>
                )}

                {!session.isFree && !paymentSetup && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start gap-[10px] w-full max-w-[384px] min-h-[66px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]"
                    whileHover={{ borderColor: '#781E36' }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={agree}
                      onClick={() => setAgree(!agree)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors mt-0.5 ${agree ? 'border-[#781E36] bg-[#781E36]' : 'border-[#6B5B57] bg-transparent'}`}
                    >
                      {agree && <span className="text-white text-xs leading-none">&#10003;</span>}
                    </button>
                    <p className="text-[#6B5B57] text-xs leading-[18px]">
                      {t('agreePrefix')}{' '}
                      <Link href="/terms-and-conditions" className="font-semibold text-[#781E36] underline hover:text-[#B83A4A] transition-colors">
                        {t('agreeTerms')}
                      </Link>{' '}
                      {t('agreeAnd')}{' '}
                      <Link href="/privacy-policy" className="font-semibold text-[#781E36] underline hover:text-[#B83A4A] transition-colors">
                        {t('agreePrivacy')}
                      </Link>
                    </p>
                  </motion.div>
                )}

                {session.bookingNotice && (
                  <p className="text-[#B83A4A] text-xs leading-[18px]">
                    {session.bookingNotice}
                  </p>
                )}

                {errorMessage && (
                  <div className="w-full rounded-[10px] border border-[#B83A4A] bg-[#B83A4A]/5 px-4 py-3">
                    <p className="text-sm font-medium text-[#B83A4A]">{errorMessage}</p>
                  </div>
                )}

                {session.isFree ? (
                  <motion.div variants={itemVariants} className="flex flex-col gap-[10px] w-full mt-2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleFreeSubmit}
                        className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#781E36] px-[10px] text-base font-bold text-white hover:bg-[#B83A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Booking...' : t('confirmBooking')}
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        className="w-full h-[60px] rounded-[10px] border-2 border-[#781E36] bg-transparent px-[10px] text-base font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors"
                        onClick={() => window.history.back()}
                      >
                        {t('backToSession')}
                      </button>
                    </motion.div>
                  </motion.div>
                ) : paymentSetup ? (
                  stripePromise ? (
                    <Elements stripe={stripePromise} options={elementsOptions}>
                      <StripeCheckout
                        onSuccess={handlePaymentSuccess}
                        onBack={() => {
                          setPaymentSetup(null);
                          setErrorMessage(null);
                        }}
                      />
                    </Elements>
                  ) : (
                    <div className="w-full rounded-[10px] border border-[#B83A4A] bg-[#B83A4A]/5 px-4 py-3">
                      <p className="text-sm font-medium text-[#B83A4A]">
                        {t('paymentNotConfigured') || 'Online payment is not available right now. Please contact support.'}
                      </p>
                    </div>
                  )
                ) : (
                  <motion.div variants={itemVariants} className="flex flex-col gap-[10px] w-full mt-2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleStartPayment}
                        className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#781E36] px-[10px] text-base font-bold text-white hover:bg-[#B83A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Checking availability...' : t('payAndBook')}
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        className="w-full h-[60px] rounded-[10px] border-2 border-[#781E36] bg-transparent px-[10px] text-base font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors"
                        onClick={() => window.history.back()}
                      >
                        {t('backToSession')}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
