import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './constants';

export function buildMetadata({
  title,
  description,
  ...overrides
}: Partial<Metadata> & { title: string; description: string }): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} — ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    ...overrides,
  };
}
