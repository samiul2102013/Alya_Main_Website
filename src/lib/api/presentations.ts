export interface PagePresentation {
  id: string;
  key: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  badge: string;
  heroImage: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getPresentation(key: string): Promise<PagePresentation | null> {
  try {
    const res = await fetch(`${API_URL}/presentations/${encodeURIComponent(key)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PagePresentation;
  } catch (e) {
    console.warn(`[presentations] Failed to load "${key}":`, e);
    return null;
  }
}

export async function getPresentations(): Promise<PagePresentation[]> {
  try {
    const res = await fetch(`${API_URL}/presentations`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json)) return json;
    return (json?.data as PagePresentation[]) ?? [];
  } catch (e) {
    console.warn('[presentations] Failed to load list:', e);
    return [];
  }
}
