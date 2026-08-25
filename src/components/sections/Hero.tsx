'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Section from '../shared/Section';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Landmark,
  MessageSquare,
  Calendar,
  Coins,
} from 'lucide-react';

export default function Hero() {
  const t = useTranslations('home.hero');
  const isRtl = useLocale() === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [isTouch, setIsTouch] = useState(false);
  const pictureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltAngle = isTouch ? 3 : 4;
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAngle, -tiltAngle]), { damping: 25, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAngle, tiltAngle]), { damping: 25, stiffness: 150 });

  function handlePointerMove(e: React.PointerEvent) {
    const rect = pictureRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }
  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  const floatingCards = [
    {
      id: 'card-1',
      titlePrimary: t('card1a'),
      titleSecondary: t('card1b'),
      icon: <Landmark className="h-5 w-5 text-[#781E36]" />,
      position: 'top-12 left-1 sm:-left-12',
      delay: 0,
      duration: 4,
    },
    {
      id: 'card-2',
      titlePrimary: t('card2a'),
      titleSecondary: t('card2b'),
      icon: <MessageSquare className="h-5 w-5 text-[#781E36]" />,
      position: 'top-24 right-1 sm:-right-10',
      delay: 0.5,
      duration: 4.5,
    },
    {
      id: 'card-3',
      titlePrimary: t('card3a'),
      titleSecondary: t('card3b'),
      icon: <Calendar className="h-5 w-5 text-[#781E36]" />,
      position: 'bottom-28 left-1 sm:-left-12',
      delay: 1,
      duration: 3.8,
    },
    {
      id: 'card-4',
      titlePrimary: t('card4a'),
      titleSecondary: t('card4b'),
      icon: <Coins className="h-5 w-5 text-[#781E36]" />,
      position: 'bottom-6 right-1 sm:-right-10',
      delay: 1.5,
      duration: 4.2,
    },
  ];

  return (
    <Section background="default" spacing="none" containerClassName="!max-w-[1440px]" className="pt-[56px] sm:pt-[96px] pb-[80px] sm:pb-[146px] overflow-hidden relative">
      {/* Heavy Futuristic Background layers — desktop only, skipped on touch for performance */}
      {!isTouch && (
        <>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 -mr-32 -mt-32 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#781E36]/20 via-[#E8CFC1]/30 to-transparent blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#FAEDE6] via-[#781E36]/15 to-transparent blur-3xl pointer-events-none"
          />

          {/* Rotating Scanline Ring */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#781E36]/10 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent 40%, #781E3615 50%, transparent 60%)',
              maskImage: 'radial-gradient(farthest-side, transparent 30%, black 70%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(farthest-side, transparent 30%, black 70%, transparent 80%)',
            }}
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#B83A4A]/10 pointer-events-none"
            style={{
              background: 'conic-gradient(from 180deg, transparent 45%, #781E3620 50%, transparent 55%)',
              maskImage: 'radial-gradient(farthest-side, transparent 40%, black 60%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(farthest-side, transparent 40%, black 60%, transparent 70%)',
            }}
          />

          {/* Floating Digital Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#781E36]/30 pointer-events-none"
              style={{
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          ))}

          {/* Animated Light Grid Lines Overlay */}
          <motion.div
            animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#781E3608_1px,transparent_1px),linear-gradient(to_bottom,#781E3608_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
          />
        </>
      )}

      {/* Soft static glow behind hero image (no repaint, no blur animation) */}
      {isTouch && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(120,30,54,0.12)_0%,transparent_65%)] pointer-events-none" />
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 min-h-[580px] relative z-10">
        {/* Left Side Text Container */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 80 : -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 }}
          className="flex flex-col self-start gap-6 lg:col-span-6 xl:col-span-7 max-w-[672px]"
        >
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <Badge
              icon={
                <motion.span
                  animate={isTouch ? undefined : { rotate: [0, 15, -15, 0] }}
                  transition={isTouch ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ShieldCheck className="h-3 w-3 text-[#781E36]" />
                </motion.span>
              }
              className="px-2.5 py-0.5 text-[11px] font-bold"
            >
              {t('eyebrow')}
            </Badge>
          </motion.div>

          {/* Main Headline with Reveal & Shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <h1 className="relative text-[28px] sm:text-5xl lg:text-6xl xl:text-[54px] font-black tracking-tight leading-[1.1] whitespace-pre-line">
              <motion.span
                className="bg-gradient-to-r from-[#781E36] via-[#B83A4A] via-[#781E36] to-[#781E36] bg-[length:250%_100%] bg-clip-text text-transparent"
                animate={isTouch ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={isTouch ? undefined : { duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                {t('title')}
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle - Staggered Word Fade In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <p className="text-base md:text-lg text-[#6B5B57] leading-relaxed font-medium overflow-hidden">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Search Bar with Animated Gradient Border */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative mt-1 flex h-[58px] w-full items-center rounded-2xl bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-[#781E36]/15"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  padding: 2,
                  background: 'linear-gradient(90deg, #E8CFC1, #781E36, #B83A4A, #E8CFC1)',
                  backgroundSize: '300% 100%',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                animate={isTouch ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={isTouch ? undefined : { duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              <Search className="relative ltr:ml-3 rtl:mr-3 h-5 w-5 shrink-0 text-[#781E36] z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="relative w-full bg-transparent px-5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none z-10"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#781E36] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#781E36]/30 cursor-pointer z-10 overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#B83A4A] to-[#781E36]"
                  animate={isTouch ? undefined : { opacity: [0, 0.5, 0] }}
                  transition={isTouch ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="relative z-10">{t('search')}</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  href="#initiatives"
                  size="lg"
                  variant="primary"
                  icon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
                >
                  {t('ctaPrimary')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button href="#consultation" size="lg" variant="secondary">
                  {t('ctaSecondary')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side Picture Container with 4 Futuristic 3D Floating Cards */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? -100 : 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative flex mt-10 justify-center lg:col-span-6 xl:col-span-5 h-[480px] sm:h-[600px] w-full max-w-[640px]"
        >
          <motion.div
            animate={isTouch ? { y: [0, -10, 0] } : undefined}
            transition={isTouch ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
            className="relative w-full h-full"
          >
            <div
              ref={pictureRef}
              onPointerMove={isTouch ? undefined : handlePointerMove}
              onPointerLeave={isTouch ? undefined : handlePointerLeave}
              className="relative w-full h-full"
              style={{ perspective: 1200 }}
            >
            {/* Ambient Hologram Glow Aura - desktop only */}
            {!isTouch && (
              <motion.div
                className="absolute -inset-4 rounded-[36px] blur-2xl pointer-events-none"
                style={{
                  background: 'conic-gradient(from var(--angle, 0deg), #781E3640, #E8CFC1, #B83A4A40, #781E3640)',
                }}
                animate={{
                  '--angle': ['0deg', '360deg'],
                } as any}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Main Picture Box with 3D Tilt */}
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative h-full w-full overflow-hidden rounded-[30px] border-2 border-[#E8CFC1] bg-white p-3 shadow-2xl transition-shadow duration-300 hover:shadow-[#781E36]/20"
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-[22px]"
              >
                <Image
                  src="/Static/Home/Hero/Emirati couple looking at UAE skyline.png"
                  alt="Emirati couple looking at UAE skyline"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
                {/* Cinematic Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  animate={isTouch ? undefined : { opacity: [0.4, 0.6, 0.4] }}
                  transition={isTouch ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Scanning Line Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 48%, rgba(120,30,54,0.15) 50%, transparent 52%)',
                    backgroundSize: '100% 8px',
                  }}
                  animate={isTouch ? undefined : { backgroundPosition: ['0px -100%', '0px 100%'] }}
                  transition={isTouch ? undefined : { duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>

            {/* 4 Futuristic Floating Cards */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: isTouch ? [0, -7, 0] : [0, -10, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.4 + card.delay },
                  scale: { duration: 0.5, delay: 0.4 + card.delay },
                  y: {
                    duration: card.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: card.delay,
                  },
                }}
                whileHover={{ scale: 1.1, borderColor: '#781E36' }}
                className={`absolute ${card.position} z-20 flex items-center gap-3 sm:gap-4 rounded-2xl border border-[#E8CFC1] ${isTouch ? 'bg-white' : 'bg-white/95 backdrop-blur-md'} p-3 sm:p-4 shadow-2xl transition-shadow duration-300 hover:shadow-[#781E36]/20 cursor-pointer`}
              >
                <motion.div
                  className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#FAEDE6] border border-[#E8CFC1]"
                  whileHover={{ rotate: 10 }}
                >
                  {card.icon}
                </motion.div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm sm:text-base font-black tracking-tight text-[#781E36]">
                    {card.titlePrimary}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 leading-tight">
                    {card.titleSecondary}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
