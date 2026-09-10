export interface FooterLink {
  label: string;
  labelAr?: string;
  href: string;
}

export interface FooterContent {
  id: string;
  brandText: string;
  brandTextAr: string;
  governmentLabel: string;
  governmentLabelAr: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  quickLinks: FooterLink[];
  resourceLinks: FooterLink[];
  published: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getFooterContent(): Promise<FooterContent | null> {
  try {
    const res = await fetch(`${API_URL}/footer`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as FooterContent;
  } catch (e) {
    console.warn('[footer] Failed to load footer content:', e);
    return null;
  }
}
