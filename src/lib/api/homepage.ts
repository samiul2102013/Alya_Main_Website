export interface FloatingCard {
  label: string;
  labelAr: string;
  sublabel: string;
  sublabelAr: string;
}

export interface StatItem {
  value: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
}

export interface HomepageContent {
  id: string;
  heroEyebrow: string;
  heroEyebrowAr: string;
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroSearchPlaceholder: string;
  heroSearchPlaceholderAr: string;
  heroSearchButton: string;
  heroSearchButtonAr: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLabelAr: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLabelAr: string;
  heroSecondaryCtaLink: string;
  heroImage: string;
  heroImageAlt: string;
  heroFloatingCards: FloatingCard[];
  stats: StatItem[];
  shortsTitle: string;
  shortsTitleAr: string;
  shortsSubtitle: string;
  shortsSubtitleAr: string;
  shortsCtaLabel: string;
  shortsCtaLabelAr: string;
  shortsEmptyText: string;
  shortsEmptyTextAr: string;
  newsTitle: string;
  newsTitleAr: string;
  newsSubtitle: string;
  newsSubtitleAr: string;
  newsCtaLabel: string;
  newsCtaLabelAr: string;
  initiativesTitle: string;
  initiativesTitleAr: string;
  initiativesSubtitle: string;
  initiativesSubtitleAr: string;
  initiativesCtaLabel: string;
  initiativesCtaLabelAr: string;
  consultationsTitle: string;
  consultationsTitleAr: string;
  consultationsSubtitle: string;
  consultationsSubtitleAr: string;
  consultationsCtaLabel: string;
  consultationsCtaLabelAr: string;
  consultationsFreeTab: string;
  consultationsFreeTabAr: string;
  consultationsPaidTab: string;
  consultationsPaidTabAr: string;
  emiratesTitle: string;
  emiratesTitleAr: string;
  emiratesSubtitle: string;
  emiratesSubtitleAr: string;
  emiratesCapitalLabel: string;
  emiratesCapitalLabelAr: string;
  emiratesHeadquartersLabel: string;
  emiratesHeadquartersLabelAr: string;
  emiratesCtaLabel: string;
  emiratesCtaLabelAr: string;
  ctaTitle: string;
  ctaTitleAr: string;
  ctaSubtitle: string;
  ctaSubtitleAr: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLabelAr: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLabelAr: string;
  ctaSecondaryLink: string;
  sectionVisibility?: SectionVisibility;
}

export interface SectionVisibility {
  hero: boolean;
  stats: boolean;
  shorts: boolean;
  news: boolean;
  initiatives: boolean;
  consultations: boolean;
  emirates: boolean;
  cta: boolean;
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  hero: true,
  stats: true,
  shorts: true,
  news: true,
  initiatives: true,
  consultations: true,
  emirates: true,
  cta: true,
};

export function resolveSectionVisibility(value?: SectionVisibility | null): SectionVisibility {
  return { ...DEFAULT_SECTION_VISIBILITY, ...(value ?? {}) };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const res = await fetch(`${API_URL}/homepage`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as HomepageContent;
  } catch (e) {
    console.warn('[homepage] Failed to load homepage content:', e);
    return null;
  }
}
