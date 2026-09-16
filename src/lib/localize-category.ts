import { pickLocalized } from '@/lib/auto-translate';

const CATEGORY_AR: Record<string, string> = {
  marriage: 'الزواج',
  family: 'الأسرة',
  counseling: 'الاستشارات',
  community: 'المجتمع',
  policy: 'السياسة',
  education: 'التعليم',
  academic: 'الأكاديمية',
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
  organizations: 'المؤسسات',
  organization: 'المؤسسة',
  government: 'حكومي',
  communication: 'التواصل',
  psychology: 'علم النفس',
};

const MARITAL_STAGE_AR: Record<string, string> = {
  premarital: 'قبل الزواج',
  'pre-marital': 'قبل الزواج',
  premaritial: 'قبل الزواج', // common typo reported by user
  marital: 'أثناء الزواج',
  postmarital: 'بعد الزواج',
  'post-marital': 'بعد الزواج',
  postMarital: 'بعد الزواج',
  'all stages': 'جميع المراحل',
};

const ORGANIZATION_AR: Record<string, string> = {
  'marage academy': 'أكاديمية مرج',
  'marage finance': 'مرج المالية',
  'marage culture': 'مرج الثقافية',
  'marage counseling': 'مرج للاستشارات',
  'marage health': 'مرج الصحية',
  'marage support': 'دعم مرج',
  'marage': 'مرج',
  'ministry of community development': 'وزارة تنمية المجتمع',
  'family development foundation': 'مؤسسة التنمية الأسرية',
  'dubai economy': 'اقتصادية دبي',
  'emirates health services': 'مؤسسة الإمارات للخدمات الصحية',
  'umm al quwain government': 'حكومة أم القيوين',
  organizations: 'المؤسسات',
  organization: 'المؤسسة',
  academic: 'الأكاديمية',
  marriage: 'الزواج',
};

function safeString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') return '';
  return String(value).trim();
}

/**
 * Localize a free-text API category value.
 * Backend now returns categoryAr when available; this map is fallback for legacy rows.
 */
export function localizeCategory(category: unknown, isArabic: boolean): string {
  const raw = safeString(category);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase();
  // Prefer backend-provided translation via map fallback, otherwise return source
  return CATEGORY_AR[key] ?? raw;
}

export function localizeMaritalStage(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().replace(/\s+/g, '');
  // normalize: try exact lower, then compact
  const lower = raw.toLowerCase().trim();
  return MARITAL_STAGE_AR[lower] ?? MARITAL_STAGE_AR[key] ?? MARITAL_STAGE_AR[raw] ?? raw;
}

export function localizeOrganization(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return ORGANIZATION_AR[key] ?? raw;
}

/**
 * Localize a title that may carry an Arabic variant.
 * Uses synchronous fallback: Arabic if present else English, English if present else Arabic.
 */
export function localizeTitle(title: unknown, titleAr: unknown, isArabic: boolean): string {
  return pickLocalized(title, titleAr, isArabic);
}

/** Format a date string according to locale (Arabic uses ar-EG gregorian). */
export function formatLocalizedDate(dateStr: string | null | undefined, isArabic: boolean): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return safeString(dateStr);
  const locale = isArabic ? 'ar-EG' : 'en-US';
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}
