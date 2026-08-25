export interface PublicEmirate {
  id: string;
  slug: string;
  emiratesName: string;
  title: string;
  description: string;
  centerCount: string;
  image: string;
  status: string;
}

export interface PublicEmirateInitiative {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  coverImage: string;
  officialWebsiteUrl: string;
  shareUrl: string;
}

export interface PublicEmirateDetail extends PublicEmirate {
  emiratesNameAr: string;
  dateTime: string | null;
  contactPhone: string;
  serviceCenters: number;
  websiteUrl: string;
  showStatus: boolean;
  initiatives: PublicEmirateInitiative[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getPublishedEmirates(
  params: Record<string, string> = {},
): Promise<PublicEmirate[]> {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API_URL}/emirates${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load emirates (${res.status})`);
    const json = await res.json();
    if (Array.isArray(json)) return json;
    return (json?.data as PublicEmirate[]) ?? [];
  } catch (error) {
    console.warn('[emirates] Falling back to empty list:', error);
    return [];
  }
}

export async function getEmirateBySlug(
  slug: string,
): Promise<PublicEmirateDetail | null> {
  try {
    const res = await fetch(`${API_URL}/emirates/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load emirate (${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.warn(`[emirates] Failed to fetch emirate "${slug}":`, error);
    return null;
  }
}