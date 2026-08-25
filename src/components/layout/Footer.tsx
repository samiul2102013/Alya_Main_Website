'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Container from '../shared/Container';
import Reveal from '../shared/Reveal';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + i * 0.1 },
  }),
};

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 + i * 0.05 },
  }),
};

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border-t border-[#E8CFC1] bg-white pt-[80px] pb-[40px] text-gray-700"
    >
      <Container className="!max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Main Bio */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-30px' }}
            className="flex flex-col gap-4 lg:col-span-4 max-w-[416px] pb-[34px] min-h-[205px]"
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/Static/alia-logo.png"
                alt="ALIA Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-xs md:text-sm leading-relaxed text-[#6B5B57]">
              {t('brand')}
            </p>
            <motion.div
              className="text-xs font-extrabold text-[#781E36]"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              {t('governmentInitiative')}
            </motion.div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            custom={1}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-30px' }}
            className="flex flex-col gap-[24px] lg:col-span-3 max-w-[272px] min-h-[236px]"
          >
            <h4 className="text-base font-extrabold text-[#781E36] tracking-wide">{t('quickLinks')}</h4>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm font-semibold">
              {[
                { label: t('home'), href: '/' },
                { label: t('about'), href: '/about' },
                { label: t('contact'), href: '/contact' },
                { label: t('nationalInitiatives'), href: '/initiatives' },
                { label: t('emiratesCenters'), href: '/emirates' },
                { label: t('privacyPolicy'), href: '/privacy-policy' },
                { label: t('termsConditions'), href: '/terms-and-conditions' },
              ].map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Link href={item.href} className="hover:text-[#781E36] transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div
            custom={2}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-30px' }}
            className="flex flex-col gap-[24px] lg:col-span-3 max-w-[272px] pb-[40px] min-h-[236px]"
          >
            <h4 className="text-base font-extrabold text-[#781E36] tracking-wide">{t('resources')}</h4>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm font-semibold">
              {[
                { label: t('weddingGrants'), href: '#' },
                { label: t('familyLaw'), href: '#' },
                { label: t('housing'), href: '#' },
                { label: t('media'), href: '/news' },
              ].map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-30px' }}
                >
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Link href={item.href} className="hover:text-[#781E36] transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contacts */}
          <motion.div
            custom={3}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-30px' }}
            className="flex flex-col gap-[24px] lg:col-span-2 max-w-[272px] pb-[8px] min-h-[236px]"
          >
            <h4 className="text-base font-extrabold text-[#781E36] tracking-wide">{t('contacts')}</h4>
            <div className="flex flex-col gap-3 text-xs md:text-sm font-semibold">
              <motion.div
                className="flex items-center gap-2.5"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="h-4 w-4 text-[#781E36] shrink-0" />
                <span>+971 800 2542</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2.5"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-4 w-4 text-[#781E36] shrink-0" />
                <span className="truncate">support@alia.gov.ae</span>
              </motion.div>
              <motion.div
                className="flex items-start gap-2.5"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-4 w-4 text-[#781E36] shrink-0 mt-1" />
                <span>Abu Dhabi, UAE</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <Reveal delay={0.3} direction="up">
          <motion.div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6B5B57]"
            whileHover={{ color: '#781E36' }}
            transition={{ duration: 0.3 }}
          >
            <p>© {new Date().getFullYear()} {t('allRights')}</p>
            <motion.div
              className="flex items-center gap-1.5 text-xs"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>{t('builtFor')}</span>
              <Heart className="h-3.5 w-3.5 fill-[#781E36] text-[#781E36]" />
            </motion.div>
          </motion.div>
        </Reveal>
      </Container>
    </motion.footer>
  );
}
