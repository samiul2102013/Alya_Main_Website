export interface PublicInitiative {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  category: string;
  emirates: string;
  startDate: string | null;
  endDate: string | null;
  coverImage: string;
  badge: string;
  officialWebsiteUrl: string;
  shareUrl: string;
  isFeatured: boolean;
  status: string;
}

export interface PublicInitiativeDetail extends PublicInitiative {
  description: string;
  purpose: string;
  objectives: string[];
  basicInformation: string[];
  supportOffered: Record<string, boolean>;
  benefits: string[];
  contact: string[];
  showAbout: boolean;
  showSupportOffered: boolean;
  showBenefits: boolean;
  showApplicationForm: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getPublishedInitiatives(
  params: Record<string, string> = {},
): Promise<PublicInitiative[]> {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API_URL}/initiatives${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load initiatives (${res.status})`);
    const json = await res.json();
    if (Array.isArray(json)) return json;
    return (json?.data as PublicInitiative[]) ?? [];
  } catch (error) {
    console.warn('[initiatives] Falling back to empty list:', error);
    return [];
  }
}

export async function getFeaturedInitiative(): Promise<PublicInitiativeDetail | null> {
  try {
    const res = await fetch(`${API_URL}/initiatives/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load featured initiative (${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.warn('[initiatives] Failed to fetch featured initiative:', error);
    return null;
  }
}

export async function getInitiativeBySlug(slug: string): Promise<PublicInitiativeDetail | null> {
  try {
    const res = await fetch(`${API_URL}/initiatives/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load initiative (${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.warn(`[initiatives] Failed to fetch initiative "${slug}":`, error);
    return null;
  }
}