'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, HelpCircle, HeadphonesIcon, Send } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { useContactContent } from '@/hooks/useContactContent';
import { pickLocalized } from '@/lib/auto-translate';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

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

export default function ContactPage() {
  const t = useTranslations('contact');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { content: contactContent, notFound, localize } = useContactContent();

  if (notFound) {
    return (
      <div className="bg-[#FAEDE6] min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-base font-normal text-[#6B5B57]">{isArabic ? 'المحتوى غير متوفر.' : 'This content is not available.'}</p>
        <Link href="/" className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#781E36] px-6 text-sm font-bold text-white hover:bg-[#B83A4A] transition-colors">{tNav('home')}</Link>
      </div>
    );
  }

  // Localized CMS values with i18n fallback
  const cmsTitle = pickLocalized(contactContent?.title, contactContent?.titleAr, isArabic) || t('title');
  const cmsDescription = pickLocalized(contactContent?.description, contactContent?.descriptionAr, isArabic) || t('description');
  const cmsBrowseSession = pickLocalized(contactContent?.browseSession, contactContent?.browseSessionAr, isArabic) || t('browseSession');
  const cmsContactSupport = pickLocalized(contactContent?.contactSupport, contactContent?.contactSupportAr, isArabic) || t('contactSupport');

  const cmsSendMessage = pickLocalized(contactContent?.sendMessage, contactContent?.sendMessageAr, isArabic) || t('sendMessage');
  const cmsSendMessageSub = pickLocalized(contactContent?.sendMessageSub, contactContent?.sendMessageSubAr, isArabic) || t('sendMessageSub');
  const cmsFullName = pickLocalized(contactContent?.fullName, contactContent?.fullNameAr, isArabic) || t('fullName');
  const cmsFullNamePlaceholder = pickLocalized(contactContent?.fullNamePlaceholder, contactContent?.fullNamePlaceholderAr, isArabic) || t('fullNamePlaceholder');
  const cmsEmailLabel = pickLocalized(contactContent?.emailLabel, contactContent?.emailLabelAr, isArabic) || t('email');
  const cmsEmailPlaceholder = pickLocalized(contactContent?.emailPlaceholder, contactContent?.emailPlaceholderAr, isArabic) || t('emailPlaceholder');
  const cmsUserType = pickLocalized(contactContent?.userType, contactContent?.userTypeAr, isArabic) || t('userType');
  const cmsSelectUserType = pickLocalized(contactContent?.selectUserType, contactContent?.selectUserTypeAr, isArabic) || t('selectUserType');
  const cmsIndividual = pickLocalized(contactContent?.individual, contactContent?.individualAr, isArabic) || t('individual');
  const cmsCouple = pickLocalized(contactContent?.couple, contactContent?.coupleAr, isArabic) || t('couple');
  const cmsOrganization = pickLocalized(contactContent?.organization, contactContent?.organizationAr, isArabic) || t('organization');
  const cmsSubjectLabel = pickLocalized(contactContent?.subjectLabel, contactContent?.subjectLabelAr, isArabic) || t('subject');
  const cmsSubjectPlaceholder = pickLocalized(contactContent?.subjectPlaceholder, contactContent?.subjectPlaceholderAr, isArabic) || t('subjectPlaceholder');
  const cmsPhoneLabel = pickLocalized(contactContent?.phoneLabel, contactContent?.phoneLabelAr, isArabic) || t('phone');
  const cmsPhonePlaceholder = pickLocalized(contactContent?.phonePlaceholder, contactContent?.phonePlaceholderAr, isArabic) || t('phonePlaceholder');
  const cmsMessageLabel = pickLocalized(contactContent?.messageLabel, contactContent?.messageLabelAr, isArabic) || t('message');
  const cmsMessagePlaceholder = pickLocalized(contactContent?.messagePlaceholder, contactContent?.messagePlaceholderAr, isArabic) || t('messagePlaceholder');
  const cmsSendButton = pickLocalized(contactContent?.sendButton, contactContent?.sendButtonAr, isArabic) || t('send');
  const cmsSending = pickLocalized(contactContent?.sending, contactContent?.sendingAr, isArabic) || t('sending') || 'Sending...';
  const cmsContactInfo = pickLocalized(contactContent?.contactInfo, contactContent?.contactInfoAr, isArabic) || t('contactInfo');
  const cmsOfficeAddress = pickLocalized(contactContent?.officeAddress, contactContent?.officeAddressAr, isArabic) || t('officeAddress');
  const cmsWorkingHours = pickLocalized(contactContent?.workingHours, contactContent?.workingHoursAr, isArabic) || t('workingHours');
  const cmsGeneralInquiries = pickLocalized(contactContent?.generalInquiries, contactContent?.generalInquiriesAr, isArabic) || t('generalInquiries');
  const cmsSupportHeading = pickLocalized(contactContent?.supportHeading, contactContent?.supportHeadingAr, isArabic) || t('support');
  const cmsOurLocation = pickLocalized(contactContent?.ourLocation, contactContent?.ourLocationAr, isArabic) || t('ourLocation');
  const cmsOurLocationText = pickLocalized(contactContent?.ourLocationText, contactContent?.ourLocationTextAr, isArabic) || t('ourLocationText');
  const cmsMapTitle = pickLocalized(contactContent?.mapTitle, contactContent?.mapTitleAr, isArabic) || t('mapTitle');
  const successMsg = pickLocalized(contactContent?.successMessage, contactContent?.successMessageAr, isArabic) || t('successMessage');

  const i18nAddressLines = t.raw('addressLines') as string[];
  const i18nHoursLines = t.raw('hoursLines') as string[];
  const i18nInquiriesLines = t.raw('inquiriesLines') as string[];
  const i18nSupportLines = t.raw('supportLines') as string[];

  const addressLines = isArabic && contactContent?.addressLinesAr?.length ? contactContent.addressLinesAr : (contactContent?.addressLines?.length ? contactContent.addressLines : i18nAddressLines);
  const hoursLines = isArabic && contactContent?.hoursLinesAr?.length ? contactContent.hoursLinesAr : (contactContent?.hoursLines?.length ? contactContent.hoursLines : i18nHoursLines);
  const inquiriesLines = isArabic && contactContent?.inquiriesLinesAr?.length ? contactContent.inquiriesLinesAr : (contactContent?.inquiriesLines?.length ? contactContent.inquiriesLines : i18nInquiriesLines);
  const supportLines = isArabic && contactContent?.supportLinesAr?.length ? contactContent.supportLinesAr : (contactContent?.supportLines?.length ? contactContent.supportLines : i18nSupportLines);

  const secVis = contactContent?.sectionVisibility ?? {};
  const showHero        = true;
  const showFormLabels  = secVis.formLabels !== false;
  const showContactInfo = secVis.contactInfo !== false;
  const showLocationMap = secVis.locationMap !== false;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    userType: '',
    subject: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSuccess(true);
      setForm({ fullName: '', email: '', userType: '', subject: '', phone: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: cmsTitle },
          ]} />
        </div>
      </Reveal>

      <Reveal delay={0.1} direction="up">
        {showHero && (
        <section className="w-full bg-white mb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex flex-col gap-8 max-w-[672px] w-full">
                <h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[48px] leading-snug md:leading-[67px]">
                  {cmsTitle}
                </h1>
                <p className="font-normal text-[#6B5B57] text-base sm:text-lg md:text-[20px] md:leading-[34px]">
                  {cmsDescription}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <Link href="/consultation" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors">
                    {cmsBrowseSession}
                  </Link>
                  <Link href="mailto:info@marage.ae" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors">
                    {cmsContactSupport}
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-[640px]">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1280&auto=format&fit=crop" alt={cmsTitle} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" priority unoptimized />
                </div>
              </div>
            </div>
          </div>
        </section>
        )}
      </Reveal>

      <Reveal delay={0.2} direction="up">
        {(showFormLabels || showContactInfo) && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="w-full bg-white rounded-[10px] border border-[#959595] border-[0.5px]">
            <div className="flex flex-col lg:flex-row gap-10 p-6 md:p-10">
              {showFormLabels && (
              <motion.div
                className="flex flex-col gap-6 w-full max-w-[640px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
              >
                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                  <span className="text-xl md:text-2xl font-bold leading-8 text-[#781E36]">
                    {cmsSendMessage}
                  </span>
                  <p className="text-sm font-normal text-[#6B5B57]">
                    {cmsSendMessageSub}
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {cmsFullName}
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      placeholder={cmsFullNamePlaceholder}
                      className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {cmsEmailLabel}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder={cmsEmailPlaceholder}
                      className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {cmsUserType}
                    </label>
                    <select
                      value={form.userType}
                      onChange={(e) => setForm((f) => ({ ...f, userType: e.target.value }))}
                      className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm text-gray-500 outline-none focus:border-[#781E36] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23989898%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                      <option>{cmsSelectUserType}</option>
                      <option>{cmsIndividual}</option>
                      <option>{cmsCouple}</option>
                      <option>{cmsOrganization}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {cmsSubjectLabel}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder={cmsSubjectPlaceholder}
                      className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[28px] text-black">
                    {cmsPhoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder={cmsPhonePlaceholder}
                    className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[28px] text-black">
                    {cmsMessageLabel}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={cmsMessagePlaceholder}
                    rows={5}
                    className="w-full rounded-[10px] border border-[#E8CFC1] bg-white px-4 py-3 text-sm outline-none focus:border-[#781E36] transition-colors resize-none"
                  />
                </motion.div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">{successMsg}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  variants={itemVariants}
                  className="flex items-center justify-center gap-2 w-full h-[56px] rounded-[10px] bg-[#781E36] text-white text-base font-bold hover:bg-[#B83A4A] transition-colors disabled:opacity-60"
                >
                  <Send className="h-5 w-5" />
                  {submitting ? cmsSending : cmsSendButton}
                </motion.button>
              </form>
              </motion.div>
              )}

              {showContactInfo && (
              <div className="flex flex-col gap-6 w-full max-w-[460px] pt-0 lg:pt-[52px]">
                <span className="text-xl md:text-2xl font-bold leading-8 text-[#781E36]">
                  {cmsContactInfo}
                </span>

                <motion.div
                  className="flex flex-col gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  {[
                    {
                      icon: <MapPin className="h-6 w-6 text-[#781E36]" />,
                      title: cmsOfficeAddress,
                      lines: addressLines,
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-[#781E36]" />,
                      title: cmsWorkingHours,
                      lines: hoursLines,
                    },
                    {
                      icon: <HelpCircle className="h-6 w-6 text-[#781E36]" />,
                      title: cmsGeneralInquiries,
                      lines: inquiriesLines,
                    },
                    {
                      icon: <HeadphonesIcon className="h-6 w-6 text-[#781E36]" />,
                      title: cmsSupportHeading,
                      lines: supportLines,
                    },
                  ].map((item, i) => (
                    <motion.div key={i} variants={itemVariants} className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[10px] bg-[#FAEDE6] shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-semibold leading-6 text-[#781E36]">
                          {item.title}
                        </span>
                        {item.lines.map((line, j) => (
                          <span key={j} className="text-[13px] font-normal leading-5 text-[#6B5B57]">
                            {line}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              )}
            </div>
          </div>
        </div>
        )}
      </Reveal>

      <Reveal delay={0.3} direction="up">
        {showLocationMap && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-[30px] w-full bg-white">
            <div className="flex items-center gap-[26px]">
              <div className="flex items-center justify-center w-[56px] h-[56px] rounded-[14px] bg-[#FAEDE6] shrink-0">
                <MapPin className="h-7 w-7 text-[#781E36]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl md:text-[22px] font-bold leading-[30px] text-[#781E36]">
                  {cmsOurLocation}
                </span>
                <p className="text-sm font-normal text-[#6B5B57]">
                  {cmsOurLocationText}
                </p>
              </div>
            </div>

            <div className="w-full h-[300px] sm:h-[400px] md:h-[559px] rounded-[16px] overflow-hidden bg-gray-100">
              <iframe
                src={contactContent?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68267795774!2d54.94728799835648!3d25.07627346646599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e508b10a1b0!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1698765432100"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={cmsMapTitle}
              />
            </div>
          </div>
        </div>
        )}
      </Reveal>
    </div>
  );
}
