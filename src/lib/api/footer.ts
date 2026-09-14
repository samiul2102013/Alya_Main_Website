export interface FooterLink {
  label: string;
  labelAr?: string;
  href: string;
}

export interface FooterContent {
  id: string;
  logoUrl?: string;
  brandText: string;
  brandTextAr: string;
  governmentLabel: string;
  governmentLabelAr: string;
  quickLinksHeading?: string;
  quickLinksHeadingAr?: string;
  resourceLinksHeading?: string;
  resourceLinksHeadingAr?: string;
  contactsHeading?: string;
  contactsHeadingAr?: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  quickLinks: FooterLink[];
  resourceLinks: FooterLink[];
  copyrightText?: string;
  copyrightTextAr?: string;
  builtForText?: string;
  builtForTextAr?: string;
  published: boolean;
  sectionVisibility?: Record<string, boolean>;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getFooterContent(): Promise<FooterContent | null> {
  try {
    const res = await fetch(`${API_URL}/footer`, {
      // Prefetch footer DB data on the server (layout.tsx) like all other CMS
      // models (homepage/about/contact). ISR 60s keeps routes statically
      // generated while admin edits appear within a minute; tag allows
      // on-demand revalidation via POST /api/revalidate?tag=footer if needed.
      next: { revalidate: 60, tags: ['footer'] },
    });
    if (!res.ok) return null;
    return (await res.json()) as FooterContent;
  } catch (e) {
    console.warn('[footer] Failed to load footer content:', e);
    return null;
  }
}
