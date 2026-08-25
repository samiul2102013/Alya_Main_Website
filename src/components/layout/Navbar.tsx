'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Container from '../shared/Container';
import Button from '../shared/Button';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + i * 0.05 },
  }),
};

function UAEIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0">
      <rect x="0" y="0" width="5" height="14" fill="#FF0000" />
      <rect x="5" y="0" width="15" height="4.67" fill="#009E00" />
      <rect x="5" y="4.67" width="15" height="4.66" fill="#FFFFFF" />
      <rect x="5" y="9.33" width="15" height="4.67" fill="#000000" />
    </svg>
  );
}

function UKIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0">
      <rect x="0" y="0" width="20" height="14" fill="#012169" />
      <polygon points="0,0 20,14 20,0" fill="white" opacity="0.3" />
      <polygon points="0,14 20,0 0,0" fill="white" opacity="0.3" />
      <rect x="9" y="0" width="2" height="14" fill="white" />
      <rect x="0" y="6" width="20" height="2" fill="white" />
      <rect x="9" y="0" width="2" height="14" fill="#E4002B" />
      <rect x="0" y="6" width="20" height="2" fill="#E4002B" />
    </svg>
  );
}
export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
    { label: t('shorts'), href: '/shorts' },
    { label: t('news'), href: '/news' },
    { label: t('initiatives'), href: '/initiatives' },
    { label: t('consultation'), href: '/consultation' },
    { label: t('emirates'), href: '/emirates' },
  ];

  const switchLocale = (next: 'en' | 'ar') => {
    setLangOpen(false);
    setMobileMenuOpen(false);
    if (next !== locale) {
      router.replace(pathname, { locale: next });
    }
  };

  const isArabic = locale === 'ar';

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
    >
      <Container className="grid h-[72px] md:h-[100px] grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 lg:gap-6 py-[10px] !max-w-[1440px] !px-3 sm:!px-4 lg:!px-6">
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="justify-self-start shrink-0"
        >
          <Link href="/" className="group flex items-center focus:outline-none">
            <Image
              src="/Static/alia-logo.png"
              alt="ALIA Logo"
              width={isArabic ? 48 : 56}
              height={isArabic ? 48 : 56}
              className="object-contain"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-[18px] xl:gap-[20px] lg:flex justify-center justify-self-center">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i}
              variants={navLinkVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={link.href}
                className="relative text-[13px] xl:text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-[#781E36] py-1 whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#781E36] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Actions (Language Dropdown + CTA) */}
        <motion.div
          className="justify-self-end hidden items-center gap-3 sm:gap-4 md:flex shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {/* Language Dropdown */}
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t('language')}
              className="flex h-[40px] w-[124px] items-center justify-center gap-2 rounded-xl border border-[#E8CFC1] bg-[#FAEDE6] text-xs font-bold text-[#781E36] transition-all duration-300 hover:border-[#781E36] hover:bg-[#781E36] hover:text-white shadow-xs cursor-pointer"
            >
              {isArabic ? <UAEIcon /> : <UKIcon />}
              <span className="rtl:order-none">{isArabic ? 'العربية' : 'English'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute start-0 end-auto md:end-0 md:start-auto top-full mt-2 w-[160px] rounded-xl border border-[#E8CFC1] bg-white shadow-xl z-50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => switchLocale('ar')}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-xs font-bold transition-colors ${
                      isArabic
                        ? 'bg-[#FAEDE6] text-[#781E36]'
                        : 'text-gray-700 hover:bg-[#FAEDE6]'
                    }`}
                  >
                    <UAEIcon />
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => switchLocale('en')}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-xs font-bold transition-colors border-t border-[#E8CFC1]/60 ${
                      !isArabic
                        ? 'bg-[#FAEDE6] text-[#781E36]'
                        : 'text-gray-700 hover:bg-[#FAEDE6]'
                    }`}
                  >
                    <UKIcon />
                    English
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button href="#cta" size="sm" variant="primary">
              {t('applyNow')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="justify-self-end flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-[#FAEDE6] lg:hidden"
          aria-label={t('toggleMenu')}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-[#781E36]" /> : <Menu className="h-6 w-6 text-[#781E36]" />}
        </motion.button>
      </Container>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#E8CFC1] bg-white shadow-xl lg:hidden"
          >
            <div className="px-6 py-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base font-semibold text-gray-800 hover:text-[#781E36] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#E8CFC1]"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => switchLocale('ar')}
                      className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-colors ${
                        isArabic
                          ? 'border-[#781E36] bg-[#781E36] text-white'
                          : 'border-[#E8CFC1] bg-[#FAEDE6] text-[#781E36]'
                      }`}
                    >
                      <UAEIcon />
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => switchLocale('en')}
                      className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-colors ${
                        !isArabic
                          ? 'border-[#781E36] bg-[#781E36] text-white'
                          : 'border-[#E8CFC1] bg-[#FAEDE6] text-[#781E36]'
                      }`}
                    >
                      <UKIcon />
                      English
                    </button>
                  </div>
                  <Button href="#cta" size="md" variant="primary" className="w-full">
                    {t('applyNow')}
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
