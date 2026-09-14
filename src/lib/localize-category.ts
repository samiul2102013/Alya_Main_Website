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
 * Backend now returns categoryAr when available, but this map is kept as
 * fallback for legacy rows where only English was stored.
 */
export function localizeCategory(category: string | undefined | null, isArabic: boolean): string {
  if (!category) return '';
  if (!isArabic) return category;
  const key = category.trim().toLowerCase();
  return CATEGORY_AR[key] ?? category;
}

/** Localize a title that may carry an Arabic variant (titleAr-style fields).
 *  Backend auto-translates when _ar is blank (single DB pattern), so this
 *  simply prefers the Ar value when in Arabic mode.
 */
export function localizeTitle(title: string, titleAr: string | undefined | null, isArabic: boolean): string {
  if (isArabic && titleAr && titleAr.trim()) return titleAr;
  if (isArabic && title && title.trim() && !titleAr) return title; // backend already auto-translated; show it
  return title || titleAr || '';
}

/** Format a date string according to locale (Arabic uses ar-EG gregorian). */
export function formatLocalizedDate(dateStr: string | null | undefined, isArabic: boolean): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const locale = isArabic ? 'ar-EG' : 'en-US';
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}
