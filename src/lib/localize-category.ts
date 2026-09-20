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
  'marage editorial team': 'فريق تحرير مرج',
  'ministry of community development': 'وزارة تنمية المجتمع',
  'family development foundation': 'مؤسسة التنمية الأسرية',
  'dubai economy': 'اقتصادية دبي',
  'emirates health services': 'مؤسسة الإمارات للخدمات الصحية',
  'umm al quwain government': 'حكومة أم القيوين',
  'zayed house for islamic culture': 'بيت زايد للثقافة الإسلامية',
  'emirates foundation': 'مؤسسة الإمارات',
  organizations: 'المؤسسات',
  organization: 'المؤسسة',
  academic: 'الأكاديمية',
  marriage: 'الزواج',
};

const EMIRATE_AR: Record<string, string> = {
  'abu dhabi': 'أبوظبي',
  'abudhabi': 'أبوظبي',
  'abu-dhabi': 'أبوظبي',
  'dubai': 'دبي',
  'sharjah': 'الشارقة',
  'ajman': 'عجمان',
  'ras al khaimah': 'رأس الخيمة',
  'rasalkhaimah': 'رأس الخيمة',
  'ras-al-khaimah': 'رأس الخيمة',
  'fujairah': 'الفجيرة',
  'umm al quwain': 'أم القيوين',
  'ummalquwain': 'أم القيوين',
  'umm-al-quwain': 'أم القيوين',
  'umm al-quwain': 'أم القيوين',
};

const SESSION_TYPE_AR: Record<string, string> = {
  counseling: 'الاستشارات',
  financial: 'المالية',
  legal: 'القانونية',
  health: 'الصحة',
  workshop: 'ورشة عمل',
  'pre-marital': 'قبل الزواج',
  premarital: 'قبل الزواج',
  marital: 'أثناء الزواج',
  postmarital: 'بعد الزواج',
  'post-marital': 'بعد الزواج',
};

const SESSION_TYPE_EN: Record<string, string> = {
  counseling: 'Counseling',
  financial: 'Financial',
  legal: 'Legal',
  health: 'Health',
  workshop: 'Workshop',
  'pre-marital': 'Pre-Marital',
  premarital: 'Premarital',
  marital: 'Marital',
  postmarital: 'Post-marital',
  'post-marital': 'Post-marital',
};

const LANGUAGE_AR: Record<string, string> = {
  ar: 'العربية',
  en: 'الإنجليزية',
  both: 'كلاهما',
};

const LANGUAGE_EN: Record<string, string> = {
  ar: 'Arabic',
  en: 'English',
  both: 'Both',
};

const SOURCE_AR: Record<string, string> = {
  government: 'حكومي',
  ngo: 'منظمة غير حكومية',
  private: 'خاص',
};

const RESOURCE_AR: Record<string, string> = {
  'official website': 'الموقع الرسمي',
  'government resources': 'الموارد الحكومية',
  'government resource': 'مورد حكومي',
  'educational resources': 'الموارد التعليمية',
  'related initiatives': 'مبادرات ذات صلة',
  'application guide': 'دليل التقديم',
  'program details': 'تفاصيل البرنامج',
  'book a session': 'احجز جلسة',
  'related initiative': 'مبادرة ذات صلة',
};

const BENEFIT_AR: Record<string, string> = {
  'financial support': 'الدعم المالي',
  'housing support': 'الدعم السكني',
  'educational support': 'الدعم التعليمي',
  'marriage training program': 'برنامج التدريب على الزواج',
  'pre-marital preparation': 'التحضير قبل الزواج',
  'pre_marital_preparation': 'التحضير قبل الزواج',
  'family mediation program': 'برنامج الوساطة الأسرية',
  'receive financial support to help reduce marriage-related expenses.': 'الحصول على دعم مالي للمساعدة في تقليل نفقات الزواج.',
  'professional consulting and strengthening relationships and resolving challenges.': 'استشارة مهنية وتقوية العلاقات وحل التحديات.',
  'access dedicated funding programs for eligible couples.': 'الوصول إلى برامج تمويل مخصصة للأزواج المؤهلين.',
  'access expert advice on building healthy and successful families.': 'الوصول إلى مشورة الخبراء حول بناء أسر صحية وناجحة.',
  'join educational courses that focus on marriage, family, and personal development.': 'الانضمام إلى دورات تعليمية تركز على الزواج والأسرة والتنمية الشخصية.',
  'connect with community initiatives and promote family well-being.': 'التواصل مع المبادرات المجتمعية وتعزيز رفاهية الأسرة.',
};

const OBJECTIVE_AR: Record<string, string> = {
  'provide financial support for eligible couples.': 'توفير الدعم المالي للأزواج المؤهلين.',
  'offer pre-marital counseling and educational workshops.': 'تقديم إرشاد ما قبل الزواج وورش عمل تعليمية.',
  'promote family stability and long-term social well-being.': 'تعزيز الاستقرار الأسري والرفاه الاجتماعي طويل المدى.',
  'encourage healthy marriages across the uae community.': 'تشجيع الزواج الصحي في جميع أنحاء المجتمع الإماراتي.',
};

const CONTACT_LABEL_AR: Record<string, string> = {
  'organization name': 'اسم المؤسسة',
  'phone number': 'رقم الهاتف',
  'email address': 'البريد الإلكتروني',
  'office address': 'العنوان',
  'working hours': 'ساعات العمل',
};

const TOPIC_TITLE_AR: Record<string, string> = {
  // Shorts
  'marriage preparation': 'التحضير للزواج',
  'relationship advice': 'نصائح العلاقات',
  'financial planning': 'التخطيط المالي',
  'family well-being': 'رفاهية الأسرة',
  'family wellbeing': 'رفاهية الأسرة',
  counseling: 'الإرشاد',
  parenting: 'التربية',
  // News
  'marriage law updates': 'مستجدات قانون الزواج',
  'community events': 'الفعاليات المجتمعية',
  'success stories': 'قصص النجاح',
  'expert opinions': 'آراء الخبراء',
  'government programs': 'البرامج الحكومية',
  'family wellness': 'العافية الأسرية',
  // Consultation
  'marriage counseling': 'الاستشارات الزوجية',
  'premarital guidance': 'التوجيه قبل الزواج',
  'family mediation': 'الوساطة الأسرية',
  'financial counseling': 'الاستشارات المالية',
  'parenting support': 'دعم الأبوة والأمومة',
  // Emirates (topic titles are emirate names, handled by EMIRATE_AR)
  'abu dhabi': 'أبوظبي',
  'dubai': 'دبي',
  'sharjah': 'الشارقة',
  'ajman': 'عجمان',
  'fujairah': 'الفجيرة',
  'ras al khaimah': 'رأس الخيمة',
  'umm al quwain': 'أم القيوين',
};

const CONTRIBUTOR_AR: Record<string, string> = {
  // Shorts
  'government programs': 'البرامج الحكومية',
  'family court experts': 'خبراء محاكم الأسرة',
  'certified counselors': 'مستشارون معتمدون',
  'ngo partners': 'شركاء منظمات غير حكومية',
  // News
  'ministry of justice': 'وزارة العدل',
  'national media council': 'المجلس الوطني للإعلام',
  'family development authority': 'هيئة تنمية الأسرة',
  'community development department': 'دائرة التنمية المجتمعية',
  'uae marriage support': 'دعم الزواج الإماراتي',
  // Consultation
  'licensed marriage counselors': 'مستشارو زواج مرخصون',
  'family therapists': 'معالجون أسريون',
  'certified coaches': 'مدربون معتمدون',
  'sharia experts': 'خبراء الشريعة',
  // Emirates
  'abu dhabi family development': 'تنمية الأسرة أبوظبي',
  'dubai marriage support center': 'مركز دعم الزواج دبي',
  'sharjah social services': 'الخدمات الاجتماعية الشارقة',
  'community development authority': 'هيئة تنمية المجتمع',
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

export function localizeEmirate(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  const compact = key.replace(/\s+/g, ' ').replace(/-/g, ' ').trim().replace(/\s+/g, ' ');
  return EMIRATE_AR[key] ?? EMIRATE_AR[compact] ?? EMIRATE_AR[key.replace(/-/g, '')] ?? raw;
}

export function localizeCity(value: unknown, isArabic: boolean): string {
  // City names overlap with emirate names in UAE
  return localizeEmirate(value, isArabic);
}

export function localizeSessionType(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  const key = raw.toLowerCase().trim();
  const map = isArabic ? SESSION_TYPE_AR : SESSION_TYPE_EN;
  return map[key] ?? raw;
}

export function localizeLanguage(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  const key = raw.toLowerCase().trim();
  const map = isArabic ? LANGUAGE_AR : LANGUAGE_EN;
  return map[key] ?? raw;
}

export function localizeSource(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return SOURCE_AR[key] ?? raw;
}

export function localizeResource(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return RESOURCE_AR[key] ?? raw;
}

export function localizeBenefit(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return BENEFIT_AR[key] ?? raw;
}

export function localizeObjective(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return OBJECTIVE_AR[key] ?? raw;
}

export function localizeContact(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  // Handle "Label: Value" format
  if (raw.includes(':')) {
    const [label, ...rest] = raw.split(':');
    const val = rest.join(':').trim();
    const labelKey = label.toLowerCase().trim();
    const localizedLabel = CONTACT_LABEL_AR[labelKey] ?? label;
    // Try to localize value part if it's an organization/emirate
    const localizedVal = ORGANIZATION_AR[val.toLowerCase()] ?? EMIRATE_AR[val.toLowerCase()] ?? val;
    return `${localizedLabel}: ${localizedVal}`;
  }
  const key = raw.toLowerCase().trim();
  return ORGANIZATION_AR[key] ?? EMIRATE_AR[key] ?? raw;
}

export function localizeBasicInfo(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  // Basic info often "Label: Value"
  if (raw.includes(':')) {
    const [label, ...rest] = raw.split(':');
    const val = rest.join(':').trim();
    const labelKey = label.toLowerCase().trim();
    // Try to map label
    const labelMap: Record<string, string> = {
      organizer: 'المنظم',
      category: 'الفئة',
      'program type': 'نوع البرنامج',
      eligibility: 'الأهلية',
      'support type': 'نوع الدعم',
    };
    const localizedLabel = labelMap[labelKey] ?? CONTACT_LABEL_AR[labelKey] ?? label;
    const key = val.toLowerCase().trim();
    const localizedVal = CATEGORY_AR[key] ?? ORGANIZATION_AR[key] ?? EMIRATE_AR[key] ?? val;
    return `${localizedLabel}: ${localizedVal}`;
  }
  const key = raw.toLowerCase().trim();
  return CATEGORY_AR[key] ?? ORGANIZATION_AR[key] ?? EMIRATE_AR[key] ?? raw;
}

export function localizeTopicTitle(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return TOPIC_TITLE_AR[key] ?? EMIRATE_AR[key] ?? raw;
}

export function localizeContributor(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const key = raw.toLowerCase().trim();
  return CONTRIBUTOR_AR[key] ?? ORGANIZATION_AR[key] ?? raw;
}

export function localizeVideosCount(value: unknown, isArabic: boolean): string {
  const raw = safeString(value);
  if (!raw) return '';
  if (!isArabic) return raw;
  const lower = raw.toLowerCase();
  const num = raw.match(/\d+/)?.[0] ?? '';
  if (lower.includes('video')) return num ? `${num} فيديو` : raw;
  if (lower.includes('session')) return num ? `${num} جلسة` : raw;
  if (lower.includes('article')) return num ? `${num} مقالاً` : raw;
  if (lower.includes('center')) return num ? `${num} مركزاً` : raw;
  if (lower.includes('program')) return num ? `${num} برنامجاً` : raw;
  if (lower.includes('expert')) return num ? `${num} خبيراً` : raw;
  if (lower.includes('all')) return 'الكل';
  return raw;
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
