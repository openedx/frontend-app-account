import { getPrimaryLanguageSubtag } from '@openedx/frontend-base';
import COUNTRIES, { langs as countryLangs } from 'i18n-iso-countries';
import arLocale from 'i18n-iso-countries/langs/ar.json';
import caLocale from 'i18n-iso-countries/langs/ca.json';
import enLocale from 'i18n-iso-countries/langs/en.json';
import esLocale from 'i18n-iso-countries/langs/es.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import heLocale from 'i18n-iso-countries/langs/he.json';
import idLocale from 'i18n-iso-countries/langs/id.json';
import koLocale from 'i18n-iso-countries/langs/ko.json';
import plLocale from 'i18n-iso-countries/langs/pl.json';
import ptLocale from 'i18n-iso-countries/langs/pt.json';
import ruLocale from 'i18n-iso-countries/langs/ru.json';
import ukLocale from 'i18n-iso-countries/langs/uk.json';
import viLocale from 'i18n-iso-countries/langs/vi.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';

/*
 * Country names localized in the languages frontend-platform used to bundle. Thai has no
 * translation in the library.
 */
COUNTRIES.registerLocale(arLocale);
COUNTRIES.registerLocale(caLocale);
COUNTRIES.registerLocale(enLocale);
COUNTRIES.registerLocale(esLocale);
COUNTRIES.registerLocale(frLocale);
COUNTRIES.registerLocale(heLocale);
COUNTRIES.registerLocale(idLocale);
COUNTRIES.registerLocale(koLocale);
COUNTRIES.registerLocale(plLocale);
COUNTRIES.registerLocale(ptLocale);
COUNTRIES.registerLocale(ruLocale);
COUNTRIES.registerLocale(ukLocale);
COUNTRIES.registerLocale(viLocale);
COUNTRIES.registerLocale(zhLocale);

export interface CountryOption {
  code: string;
  name: string;
}

/**
 * Country names for the locale, keyed by ISO 3166-1 alpha-2 code. Falls back to English for
 * locales the library has no translation for.
 */
export function getCountryMessages(locale: string): Record<string, string> {
  const primaryLanguageSubtag = getPrimaryLanguageSubtag(locale);
  const languageCode = countryLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';

  return COUNTRIES.getNames(languageCode);
}

/**
 * The countries as `{ code, name }` pairs for populating a select, in the library's order.
 */
export function getCountryList(locale: string): CountryOption[] {
  return Object.entries(getCountryMessages(locale)).map(([code, name]) => ({ code, name }));
}
