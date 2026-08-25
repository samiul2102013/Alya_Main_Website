export interface StatItem {
  id: string;
  iconName: string;
  stat: string;
  title: string;
  subtitle: string;
}

export interface MarriageShort {
  id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
  image: { src: string; alt: string };
}

export interface NewsItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: { src: string; alt: string };
}

export interface InitiativeItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  details: string;
  ctaLabel: string;
  ctaHref: string;
  image: { src: string; alt: string };
}

export interface ConsultationItem {
  id: string;
  title: string;
  name: string;
  date: string;
  time: string;
  seats: string;
  image: { src: string; alt: string };
  ctaLabel: string;
  ctaHref: string;
}

export interface EmirateItem {
  id: string;
  name: string;
  title: string;
  centerCount: string;
  isFeatured?: boolean;
  image: { src: string; alt: string };
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
    image: { src: string; alt: string };
  };
  stats: StatItem[];
  marriageShorts: MarriageShort[];
  latestNews: NewsItem[];
  initiatives: InitiativeItem[];
  consultations: ConsultationItem[];
  emirates: EmirateItem[];
  cta: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
}
