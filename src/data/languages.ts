import { getPrimaryLanguageSubtag } from '@openedx/frontend-base';
import LANGUAGES, { langs as languageLangs } from '@cospired/i18n-iso-languages';
import enLocale from '@cospired/i18n-iso-languages/langs/en.json';
import esLocale from '@cospired/i18n-iso-languages/langs/es.json';
import frLocale from '@cospired/i18n-iso-languages/langs/fr.json';
import plLocale from '@cospired/i18n-iso-languages/langs/pl.json';
import ptLocale from '@cospired/i18n-iso-languages/langs/pt.json';

/*
 * Language names localized in the languages frontend-platform used to bundle, which are the ones
 * the library provides.
 */
LANGUAGES.registerLocale(enLocale);
LANGUAGES.registerLocale(esLocale);
LANGUAGES.registerLocale(frLocale);
LANGUAGES.registerLocale(plLocale);
LANGUAGES.registerLocale(ptLocale);

export interface LanguageOption {
  code: string;
  name: string;
}

/**
 * Language names for the locale, keyed by ISO 639-1 code. Falls back to English for locales the
 * library has no translation for.
 */
export function getLanguageMessages(locale: string): Record<string, string> {
  const primaryLanguageSubtag = getPrimaryLanguageSubtag(locale);
  const languageCode = languageLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';

  return LANGUAGES.getNames(languageCode);
}

/**
 * The languages as `{ code, name }` pairs for populating a select, in the library's order.
 */
export function getLanguageList(locale: string): LanguageOption[] {
  return Object.entries(getLanguageMessages(locale)).map(([code, name]) => ({ code, name }));
}
