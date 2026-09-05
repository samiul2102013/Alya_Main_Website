'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Check, Heart, Eye, Target, BookOpen, MessageCircle, Newspaper, MapPin, Users } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Reveal from '@/components/shared/Reveal';
import { useAboutContent } from '@/hooks/useAboutContent';

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

const FALLBACK_HERO_IMAGE =
	'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1280&auto=format&fit=crop';

export default function AboutPage() {
	const t = useTranslations('about');
	const tNav = useTranslations('nav');
	const { content, localize, localizeOffering, localizeImpact } = useAboutContent();

	const fallbackObjectives = t.raw('objectives') as string[];
	const fallbackOfferings = t.raw('offerings') as { title: string; desc: string }[];
	const fallbackImpact = t.raw('impact') as { label: string; value: string }[];
	const fallbackWhyValues = t.raw('whyValues') as string[];
	const fallbackCoreValueList = t.raw('coreValueList') as string[];

	const objectives = (content?.objectives && content.objectives.length > 0) ? content.objectives : fallbackObjectives;
	const offerings = (content?.offerings && content.offerings.length > 0)
		? content.offerings.map(localizeOffering)
		: fallbackOfferings;
	const impact = (content?.impact && content.impact.length > 0)
		? content.impact.map(localizeImpact)
		: fallbackImpact;
	const whyValues = (content?.whyValues && content.whyValues.length > 0) ? content.whyValues : fallbackWhyValues;
	const coreValueList = (content?.coreValueList && content.coreValueList.length > 0) ? content.coreValueList : fallbackCoreValueList;

	const heroTitle = localize(content?.title ?? '', content?.titleAr ?? '') || t('title');
	const heroDescription = localize(content?.description ?? '', content?.descriptionAr ?? '') || t('description');
	const browseSession = localize(content?.browseSession ?? '', content?.browseSessionAr ?? '') || t('browseSession');
	const contactSupport = localize(content?.contactSupport ?? '', content?.contactSupportAr ?? '') || t('contactSupport');
	const heroImage = content?.heroImage || FALLBACK_HERO_IMAGE;
	const heroImageAlt = content?.heroImageAlt || heroTitle;

	const ourStoryTitle = localize(content?.ourStory ?? '', content?.ourStoryAr ?? '') || t('ourStory');
	const ourStoryText = localize(content?.ourStoryText ?? '', content?.ourStoryTextAr ?? '') || t('ourStoryText');

	const ourMissionTitle = localize(content?.ourMission ?? '', content?.ourMissionAr ?? '') || t('ourMission');
	const ourMissionText = localize(content?.ourMissionText ?? '', content?.ourMissionTextAr ?? '') || t('ourMissionText');

	const ourVisionTitle = localize(content?.ourVision ?? '', content?.ourVisionAr ?? '') || t('ourVision');
	const ourVisionText = localize(content?.ourVisionText ?? '', content?.ourVisionTextAr ?? '') || t('ourVisionText');

	const ourObjectiveTitle = localize(content?.ourObjective ?? '', content?.ourObjectiveAr ?? '') || t('ourObjective');
	const ourObjectiveText = localize(content?.ourObjectiveText ?? '', content?.ourObjectiveTextAr ?? '') || t('ourObjectiveText');

	const whatWeOfferTitle = localize(content?.whatWeOffer ?? '', content?.whatWeOfferAr ?? '') || t('whatWeOffer');
	const whatWeOfferText = localize(content?.whatWeOfferText ?? '', content?.whatWeOfferTextAr ?? '') || t('whatWeOfferText');

	const ourImpactTitle = localize(content?.ourImpact ?? '', content?.ourImpactAr ?? '') || t('ourImpact');
	const ourImpactText = localize(content?.ourImpactText ?? '', content?.ourImpactTextAr ?? '') || t('ourImpactText');

	const whyChooseTitle = localize(content?.whyChoose ?? '', content?.whyChooseAr ?? '') || t('whyChoose');
	const whyChooseText = localize(content?.whyChooseText ?? '', content?.whyChooseTextAr ?? '') || t('whyChooseText');

	const coreValuesTitle = localize(content?.coreValues ?? '', content?.coreValuesAr ?? '') || t('coreValues');
	const coreValuesText = localize(content?.coreValuesText ?? '', content?.coreValuesTextAr ?? '') || t('coreValuesText');

	return (
		<div className="bg-[#FAEDE6]">
			<Reveal delay={0}>
				<div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 pt-5 pb-3">
					<Breadcrumb items={[
						{ label: tNav('home'), href: '/' },
						{ label: heroTitle },
					]} />
				</div>
			</Reveal>

			<Reveal delay={0.1} direction="up">
				<section className="w-full bg-white mb-16">
					<div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
						<div className="flex flex-col md:flex-row items-center gap-10">
							<div className="flex flex-col gap-8 max-w-[672px] w-full">
								<h1 className="font-bold text-[#781E36] text-3xl sm:text-4xl md:text-[48px] leading-snug md:leading-[67px]">
									{heroTitle}
								</h1>
								<p className="font-normal text-[#6B5B57] text-base sm:text-lg md:text-[20px] md:leading-[34px]">
									{heroDescription}
								</p>
								<div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
									<Link href="/consultation" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] bg-[#781E36] px-[10px] text-sm font-bold text-white shadow-lg hover:bg-[#B83A4A] transition-colors">
										{browseSession}
									</Link>
									<Link href="/consultation" className="flex h-[60px] w-full sm:w-[300px] items-center justify-center gap-2 rounded-[20px] border-2 border-[#781E36] bg-transparent px-[10px] text-sm font-bold text-[#781E36] hover:bg-[#781E36] hover:text-white transition-colors">
										{contactSupport}
									</Link>
								</div>
							</div>
							<div className="w-full max-w-[640px]">
								<div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-[20px] overflow-hidden">
									<Image src={heroImage} alt={heroImageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" priority unoptimized />
								</div>
							</div>
						</div>
					</div>
				</section>
			</Reveal>

			<Reveal delay={0.2} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col w-full bg-white rounded-[16px] p-6 md:p-10 gap-10"
						style={{ boxShadow: '0px 4px 20px 0px #781E360A' }}
					>
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-[50px] h-[50px] rounded-[6px] border border-[#781E36] bg-white p-[10px]">
									<Heart className="h-6 w-6 text-[#781E36]" />
								</div>
								<h2 className="text-2xl md:text-[28px] font-bold text-[#781E36] leading-9">
									{ourStoryTitle}
								</h2>
							</div>
							<p className="text-base font-normal text-[#6B5B57] leading-[28px] max-w-[900px]">
								{ourStoryText}
							</p>
						</div>

						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-6"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							<motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-[16px] border border-[#E8CFC1] bg-white p-6">
								<div className="flex justify-end">
									<div className="flex items-center justify-center w-[50px] h-[50px] rounded-[6px] border border-[#781E36] bg-white p-[10px]">
										<Target className="h-6 w-6 text-[#781E36]" />
									</div>
								</div>
								<h3 className="text-xl md:text-[22px] font-bold text-[#781E36] leading-[30px]">
									{ourMissionTitle}
								</h3>
								<p className="text-sm font-normal text-[#6B5B57] leading-[24px]">
									{ourMissionText}
								</p>
							</motion.div>

							<motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-[16px] border border-[#E8CFC1] bg-white p-6">
								<div className="flex justify-end">
									<div className="flex items-center justify-center w-[50px] h-[50px] rounded-[6px] border border-[#781E36] bg-white p-[10px]">
										<Eye className="h-6 w-6 text-[#781E36]" />
									</div>
								</div>
								<h3 className="text-xl md:text-[22px] font-bold text-[#781E36] leading-[30px]">
									{ourVisionTitle}
								</h3>
								<p className="text-sm font-normal text-[#6B5B57] leading-[24px]">
									{ourVisionText}
								</p>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</Reveal>

			<Reveal delay={0.3} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-6 md:px-8">
						<div className="flex flex-col gap-2">
							<span className="text-xl font-bold leading-[28px] text-[#781E36]">
								{ourObjectiveTitle}
							</span>
							<p className="text-sm font-normal text-[#6B5B57]">
								{ourObjectiveText}
							</p>
						</div>

						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							{objectives.map((label, i) => (
								<motion.div key={i} variants={itemVariants} className="flex flex-col items-center justify-center gap-3 w-full h-auto min-h-[184px] rounded-[24px] bg-white cursor-pointer" style={{ boxShadow: '0px 4px 6px -4px #781E360D, 0px 10px 15px -3px #781E360D' }}>
									<div className="flex items-center justify-center h-[56px] w-[56px] rounded-[16px] bg-[#FAEDE6]">
										<span className="text-2xl">{['💍', '🔗', '💬', '👨‍👩‍👧‍👦', '📢', '📚'][i % 6]}</span>
									</div>
									<span className="text-center max-w-[160px] text-sm font-extrabold leading-[19px] text-[#781E36]">
										{label}
									</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</Reveal>

			<Reveal delay={0.35} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-6 md:px-8">
						<div className="flex flex-col gap-2">
							<span className="text-xl font-bold leading-[28px] text-[#781E36]">
								{whatWeOfferTitle}
							</span>
							<p className="text-sm font-normal text-[#6B5B57]">
								{whatWeOfferText}
							</p>
						</div>

						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							{offerings.map((item, i) => {
								const Icon = [BookOpen, MessageCircle, Heart, Newspaper, MapPin, Users][i % 6];
								return (
									<motion.div key={i} variants={itemVariants} className="flex flex-col w-full h-auto min-h-[184px] rounded-[12px] border border-[#781E36] bg-white p-[10px]">
										<div className="flex justify-between items-start">
											<div className="flex items-center gap-3">
												<div className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px] bg-[#FAEDE6] shrink-0">
													<Icon className="h-5 w-5 text-[#781E36]" />
												</div>
												<span className="font-medium text-[14.77px] leading-[28px] text-[#781E36]">
													{item.title}
												</span>
											</div>
											<Check className="h-5 w-5 text-[#781E36] shrink-0" />
										</div>
										<p className="mt-3 text-xs font-normal text-[#6B5B57] leading-[18px]">
											{item.desc}
										</p>
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</div>
			</Reveal>

			<Reveal delay={0.4} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col items-center gap-6 w-full bg-white rounded-[10px] py-10 px-6 md:px-12">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="text-xl font-bold leading-[28px] text-[#781E36]">
								{ourImpactTitle}
							</span>
							<p className="text-sm font-normal text-[#6B5B57]">
								{ourImpactText}
							</p>
						</div>
						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							{impact.map((item, i) => (
								<motion.div key={i} variants={itemVariants} className="flex flex-col items-center justify-center gap-3 w-full h-auto min-h-[106px] rounded-[12px] bg-[#781E36] p-[10px]">
									<span className="text-xs font-medium text-white/80 text-center leading-tight">
										{item.label}
									</span>
									<span className="text-lg font-bold text-white text-center leading-tight">
										{item.value}
									</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</Reveal>

			<Reveal delay={0.45} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col items-center gap-8 w-full bg-white border-t border-b border-[#E8CFC1] py-12 px-6 md:px-8">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="text-xl font-bold leading-[28px] text-[#781E36]">
								{whyChooseTitle}
							</span>
							<p className="text-sm font-normal text-[#6B5B57]">
								{whyChooseText}
							</p>
						</div>

						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[900px]"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							{whyValues.map((label, i) => (
								<motion.div key={i} variants={itemVariants} className="flex items-center gap-[10px] w-full h-auto min-h-[80px] rounded-[12px] border border-[#E8CFC1] bg-white p-[10px]">
									<div className="flex items-center justify-center w-[50px] h-[50px] rounded-[10px] bg-[#FAEDE6] shrink-0">
										<span className="text-xl">{['🔒', '✅', '🎯', '🧭'][i % 4]}</span>
									</div>
									<span className="font-semibold text-xl md:text-[24px] leading-10 text-[#781E36]">
										{label}
									</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</Reveal>

			<Reveal delay={0.5} direction="up">
				<div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
					<div className="flex flex-col items-center gap-6 w-full bg-white rounded-[10px] py-10 px-6 md:px-12">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="text-xl font-bold leading-[28px] text-[#781E36]">
								{coreValuesTitle}
							</span>
							<p className="text-sm font-normal text-[#6B5B57]">
								{coreValuesText}
							</p>
						</div>
						<motion.div
							className="flex items-center justify-center gap-4 flex-wrap"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, margin: '-50px' }}
						>
							{coreValueList.map((val, i) => (
								<motion.div key={i} variants={itemVariants} className="flex items-center justify-center h-auto min-h-[47px] min-w-[105px] rounded-[50px] border border-[#E8CFC1] bg-white px-[10px] py-2">
									<span className="text-sm font-semibold text-[#781E36]">
										{val}
									</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</Reveal>
		</div>
	);
}
