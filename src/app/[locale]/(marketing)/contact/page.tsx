'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, HelpCircle, HeadphonesIcon, Send } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';

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
  const addressLines = t.raw('addressLines') as string[];
  const hoursLines = t.raw('hoursLines') as string[];
  const inquiriesLines = t.raw('inquiriesLines') as string[];
  const supportLines = t.raw('supportLines') as string[];

  return (
    <div className="bg-[#FAEDE6]">
      <Reveal delay={0}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
          <Breadcrumb items={[
            { label: tNav('home'), href: '/' },
            { label: t('title') },
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
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <Link href="/consultation" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors">
                    {t('browseSession')}
                  </Link>
                  <Link href="mailto:info@marage.ae" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors">
                    {t('contactSupport')}
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-[640px]">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1280&auto=format&fit=crop" alt={t('title')} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" priority unoptimized />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
          <div className="w-full bg-white rounded-[10px] border border-[#959595] border-[0.5px]">
            <div className="flex flex-col lg:flex-row gap-10 p-6 md:p-10">
              <motion.div
                className="flex flex-col gap-6 w-full max-w-[640px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
              >
                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                  <span className="text-xl md:text-2xl font-bold leading-8 text-[#781E36]">
                    {t('sendMessage')}
                  </span>
                  <p className="text-sm font-normal text-[#6B5B57]">
                    {t('sendMessageSub')}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {t('fullName')}
                    </label>
                    <input type="text" placeholder={t('fullNamePlaceholder')} className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {t('email')}
                    </label>
                    <input type="email" placeholder={t('emailPlaceholder')} className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {t('userType')}
                    </label>
                    <select className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm text-gray-500 outline-none focus:border-[#781E36] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23989898%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                      <option>{t('selectUserType')}</option>
                      <option>{t('individual')}</option>
                      <option>{t('couple')}</option>
                      <option>{t('organization')}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-medium leading-[28px] text-black">
                      {t('subject')}
                    </label>
                    <input type="text" placeholder={t('subjectPlaceholder')} className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[28px] text-black">
                    {t('phone')}
                  </label>
                  <input type="tel" placeholder={t('phonePlaceholder')} className="w-full h-[52px] rounded-[10px] border border-[#E8CFC1] bg-white px-4 text-sm outline-none focus:border-[#781E36] transition-colors" />
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[28px] text-black">
                    {t('message')}
                  </label>
                  <textarea placeholder={t('messagePlaceholder')} rows={5} className="w-full rounded-[10px] border border-[#E8CFC1] bg-white px-4 py-3 text-sm outline-none focus:border-[#781E36] transition-colors resize-none" />
                </motion.div>

                <motion.button variants={itemVariants} className="flex items-center justify-center gap-2 w-full h-[56px] rounded-[10px] bg-[#781E36] text-white text-base font-bold hover:bg-[#B83A4A] transition-colors">
                  <Send className="h-5 w-5" />
                  {t('send')}
                </motion.button>
              </motion.div>

              <div className="flex flex-col gap-6 w-full max-w-[460px] pt-0 lg:pt-[52px]">
                <span className="text-xl md:text-2xl font-bold leading-8 text-[#781E36]">
                  {t('contactInfo')}
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
                      title: t('officeAddress'),
                      lines: addressLines,
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-[#781E36]" />,
                      title: t('workingHours'),
                      lines: hoursLines,
                    },
                    {
                      icon: <HelpCircle className="h-6 w-6 text-[#781E36]" />,
                      title: t('generalInquiries'),
                      lines: inquiriesLines,
                    },
                    {
                      icon: <HeadphonesIcon className="h-6 w-6 text-[#781E36]" />,
                      title: t('support'),
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
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3} direction="up">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
          <div className="flex flex-col gap-[30px] w-full bg-white">
            <div className="flex items-center gap-[26px]">
              <div className="flex items-center justify-center w-[56px] h-[56px] rounded-[14px] bg-[#FAEDE6] shrink-0">
                <MapPin className="h-7 w-7 text-[#781E36]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl md:text-[22px] font-bold leading-[30px] text-[#781E36]">
                  {t('ourLocation')}
                </span>
                <p className="text-sm font-normal text-[#6B5B57]">
                  {t('ourLocationText')}
                </p>
              </div>
            </div>

            <div className="w-full h-[300px] sm:h-[400px] md:h-[559px] rounded-[16px] overflow-hidden bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68267795774!2d54.94728799835648!3d25.07627346646599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e508b10a1b0!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1698765432100"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('mapTitle')}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
