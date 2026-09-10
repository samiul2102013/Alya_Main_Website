const CATEGORY_AR: Record<string, string> = {
  marriage: 'الزواج',
  family: 'الأسرة',
  counseling: 'الاستشارات',
  community: 'المجتمع',
  policy: 'السياسة',
  education: 'التعليم',
  service: 'الخدمات',
  finance: 'المالية',
  financial: 'المالية',
  health: 'الصحة',
  culture: 'الثقافة',
  initiative: 'المبادرات',
  legal: 'القانونية',
  workshop: 'ورش العمل',
  video: 'فيديو',
  news: 'الأخبار',
};

/**
 * Localize a free-text API category value.
 * Categories have no Arabic column in the backend, so known English values
 * are mapped to Arabic when the locale is Arabic; unknown values pass through.
 */
export function localizeCategory(category: string | undefined | null, isArabic: boolean): string {
  if (!category) return '';
  if (!isArabic) return category;
  const key = category.trim().toLowerCase();
  return CATEGORY_AR[key] ?? category;
}

/** Localize a title that may carry an Arabic variant (titleAr-style fields). */
export function localizeTitle(title: string, titleAr: string | undefined | null, isArabic: boolean): string {
  if (isArabic && titleAr && titleAr.trim()) return titleAr;
  return title;
}
