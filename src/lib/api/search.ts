import type { PublicInitiative } from './initiatives';
import type { PublicShort } from './shorts';
import type { PublicNews } from './news';
import type { PublicConsultation } from './consultations';
import type { PublicEmirate } from './emirates';

export interface GlobalSearchResult {
  q: string;
  shorts: PublicShort[];
  news: PublicNews[];
  consultations: PublicConsultation[];
  initiatives: PublicInitiative[];
  emirates: PublicEmirate[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getGlobalSearch(q: string): Promise<GlobalSearchResult> {
  const empty: GlobalSearchResult = { q, shorts: [], news: [], consultations: [], initiatives: [], emirates: [] };
  if (!q.trim()) return empty;
  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q.trim())}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to search (${res.status})`);
    const json = await res.json();
    return {
      q: json?.q ?? q,
      shorts: Array.isArray(json?.shorts) ? json.shorts : [],
      news: Array.isArray(json?.news) ? json.news : [],
      consultations: Array.isArray(json?.consultations) ? json.consultations : [],
      initiatives: Array.isArray(json?.initiatives) ? json.initiatives : [],
      emirates: Array.isArray(json?.emirates) ? json.emirates : [],
    };
  } catch (error) {
    console.warn('[search] Falling back to empty results:', error);
    return empty;
  }
}