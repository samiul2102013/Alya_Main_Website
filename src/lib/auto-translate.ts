/**
 * Client-side auto-translate fallback.
 * Backend already auto-translates _ar on read (single DB + runtime fallback).
 * This client helper is a second safety net: if an Ar field is still empty/English,
 * translate it in the browser so Arabic mode is never English.
 *
 * Uses MyMemory free API with localStorage cache. No key required.
 * Mirrors backend/content/translation.py behavior.
 */
const CACHE_PREFIX = 'alia_translate:';

function isArabic(text: string): boolean {
  if (!text) return false;
  const arabic = [...text].filter((c) => c >= '\u0600' && c <= '\u06FF').length;
  return arabic / Math.max(text.length, 1) > 0.3;
}

function cacheKey(text: string): string {
  return `${CACHE_PREFIX}en:ar:${text}`;
}

export async function clientTranslate(text: string): Promise<string> {
  if (!text || !text.trim()) return '';
  if (isArabic(text)) return text;
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey(text)) : null;
    if (cached) return cached;
  } catch {}

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`,
    );
    if (res.ok) {
      const data = await res.json();
      const t = (data?.responseData?.translatedText as string) || '';
      if (t && !t.includes('MYMEMORY WARNING') && t.trim() !== text.trim()) {
        try {
          localStorage.setItem(cacheKey(text), t.trim());
        } catch {}
        return t.trim();
      }
      if (t && isArabic(t)) return t.trim();
    }
  } catch {}
  return text; // fallback to original
}

/**
 * Synchronous helper — returns ar if present, else en.
 * For async auto-translate, use `useAutoTranslated` hook below.
 */
export function pickLocalized(en: string, ar: string | undefined | null, isArabic: boolean): string {
  if (isArabic && ar && ar.trim()) return ar;
  if (isArabic && en && !ar) return en; // backend already translated; if still English, async hook will replace
  return en || ar || '';
}
