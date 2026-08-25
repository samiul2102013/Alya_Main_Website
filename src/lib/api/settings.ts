export interface PublicStaticPage {
  content: string;
  updated_at: string | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getPrivacyPolicy(): Promise<PublicStaticPage | null> {
  try {
    const res = await fetch(`${API_URL}/privacy/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load privacy policy (${res.status})`);
    return res.json();
  } catch (e) {
    console.warn('[privacy] Falling back to empty content:', e);
    return null;
  }
}

export async function getTerms(): Promise<PublicStaticPage | null> {
  try {
    const res = await fetch(`${API_URL}/terms/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load terms (${res.status})`);
    return res.json();
  } catch (e) {
    console.warn('[terms] Falling back to empty content:', e);
    return null;
  }
}
