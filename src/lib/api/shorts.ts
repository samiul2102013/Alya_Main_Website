export interface PublicShort {
  id: string;
  videoTitle: string;
  videoTitleAr: string;
  slug: string;
  category: string;
  organization: string;
  maritalStage: string;
  duration: string;
  coverImage: string;
  views: number;
  publishedAt: string | null;
  status: string;
}

export interface PublicShortDetail extends PublicShort {
  family: string;
  language: string;
  videoUrl: string;
  speaker: string;
  description: string;
  keyTopics: string[];
  resources: unknown[];
  shareUrl: string;
  lastUpdated: string | null;
  showKeyTopics: boolean;
  showResources: boolean;
  showShare: boolean;
  showSpeaker: boolean;
  showViews: boolean;
  showRelated: boolean;
  relatedVideos: PublicShort[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export async function getPublishedShorts(
  params: Record<string, string> = {},
): Promise<PublicShort[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/shorts${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to load shorts (${res.status})`);
  const json = await res.json();
  if (Array.isArray(json)) return json;
  return (json?.data as PublicShort[]) ?? [];
}

export async function getPublishedShortsPage(
  params: Record<string, string> = {},
): Promise<{ data: PublicShort[]; meta: PaginationMeta }> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/shorts${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to load shorts (${res.status})`);
  const json = await res.json();
  if (Array.isArray(json)) {
    return { data: json, meta: { page: 1, perPage: json.length, total: json.length, totalPages: 1 } };
  }
  return {
    data: (json?.data as PublicShort[]) ?? [],
    meta: (json?.meta as PaginationMeta) ?? { page: 1, perPage: 10, total: 0, totalPages: 1 },
  };
}

export async function getShortBySlug(slug: string): Promise<PublicShortDetail> {
  const res = await fetch(`${API_URL}/shorts/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to load short (${res.status})`);
  return res.json();
}