/**
 * Synchronous localized-value helper for CMS/database content.
 * Backend persists Arabic and provides `*ArIsMachine` flags; frontend must not
 * call browser-side translation providers (MyMemory etc.).
 *
 * Contract:
 *  - Arabic locale: Arabic value if present (non-blank), otherwise English/source value.
 *  - English locale: English value if present (non-blank), otherwise Arabic/source value.
 *  - Never returns "[object Object]" or blank when a fallback exists.
 *  - Trims whitespace; treats blank strings as missing.
 */

function toDisplayString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  // Prevent "[object Object]" for objects/arrays
  if (typeof value === 'object') return '';
  return String(value);
}

function isNonBlank(value: string): boolean {
  return value.trim().length > 0;
}

export function pickLocalized(
  en: unknown,
  ar: unknown,
  isArabic: boolean,
): string {
  const enStr = toDisplayString(en).trim();
  const arStr = toDisplayString(ar).trim();

  const enValid = isNonBlank(enStr);
  const arValid = isNonBlank(arStr);

  if (isArabic) {
    if (arValid) return arStr;
    if (enValid) return enStr;
    return arStr || enStr;
  }
  if (enValid) return enStr;
  if (arValid) return arStr;
  return enStr || arStr;
}

/**
 * Locale-aware helper that mirrors `pickLocalized` but accepts locale string.
 */
export function localizedValue(
  en: unknown,
  ar: unknown,
  locale: string,
): string {
  return pickLocalized(en, ar, locale === 'ar');
}

/**
 * Safe helper for arrays of localized strings.
 * Returns the appropriate array based on locale, with fallback.
 */
export function pickLocalizedArray(
  en: unknown,
  ar: unknown,
  isArabic: boolean,
): string[] {
  const enArr = Array.isArray(en) ? en.filter((v) => typeof v === 'string' && v.trim()) : [];
  const arArr = Array.isArray(ar) ? ar.filter((v) => typeof v === 'string' && v.trim()) : [];
  if (isArabic) {
    if (arArr.length > 0) return arArr;
    return enArr;
  }
  if (enArr.length > 0) return enArr;
  return arArr;
}
