import languages from '@cospired/i18n-iso-languages';
import COUNTRIES, { langs as countryLangs } from 'i18n-iso-countries';

import arLanguageLocale from '@cospired/i18n-iso-languages/langs/ar.json';
import enLanguageLocale from '@cospired/i18n-iso-languages/langs/en.json';
import esLanguageLocale from '@cospired/i18n-iso-languages/langs/es.json';
import frLanguageLocale from '@cospired/i18n-iso-languages/langs/fr.json';
import heLanguageLocale from '@cospired/i18n-iso-languages/langs/he.json';
import idLanguageLocale from '@cospired/i18n-iso-languages/langs/id.json';
import koLanguageLocale from '@cospired/i18n-iso-languages/langs/ko.json';
import plLanguageLocale from '@cospired/i18n-iso-languages/langs/pl.json';
import ptLanguageLocale from '@cospired/i18n-iso-languages/langs/pt.json';
import ruLanguageLocale from '@cospired/i18n-iso-languages/langs/ru.json';
import thLanguageLocale from '@cospired/i18n-iso-languages/langs/th.json';
import ukLanguageLocale from '@cospired/i18n-iso-languages/langs/uk.json';
import viLanguageLocale from '@cospired/i18n-iso-languages/langs/vi.json';
import zhLanguageLocale from '@cospired/i18n-iso-languages/langs/zh.json';
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

COUNTRIES.registerLocale(arLocale);
COUNTRIES.registerLocale(enLocale);
COUNTRIES.registerLocale(esLocale);
COUNTRIES.registerLocale(frLocale);
COUNTRIES.registerLocale(zhLocale);
COUNTRIES.registerLocale(caLocale);
COUNTRIES.registerLocale(heLocale);
COUNTRIES.registerLocale(idLocale);
COUNTRIES.registerLocale(koLocale);
COUNTRIES.registerLocale(plLocale);
COUNTRIES.registerLocale(ptLocale);
COUNTRIES.registerLocale(ruLocale);
// COUNTRIES.registerLocale(thLocale); // Doesn't exist in lib.
COUNTRIES.registerLocale(ukLocale);
COUNTRIES.registerLocale(viLocale);

languages.registerLocale(arLanguageLocale);
languages.registerLocale(enLanguageLocale);
languages.registerLocale(esLanguageLocale);
languages.registerLocale(frLanguageLocale);
languages.registerLocale(zhLanguageLocale);
// languages.registerLocale(caLanguageLocale); // Doesn't exist in lib.
languages.registerLocale(heLanguageLocale);
languages.registerLocale(idLanguageLocale);
languages.registerLocale(koLanguageLocale);
languages.registerLocale(plLanguageLocale);
languages.registerLocale(ptLanguageLocale);
languages.registerLocale(ruLanguageLocale);
languages.registerLocale(thLanguageLocale);
languages.registerLocale(ukLanguageLocale);
languages.registerLocale(viLanguageLocale);

const getCountryMessages = (locale: string): Record<string, string> => {
  const primaryLanguageSubtag = locale.split('-')[0];
  const languageCode = countryLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';

  return COUNTRIES.getNames(languageCode);
};

const getCountryList = (locale = 'en'): Record<string, string>[] => {
  try {
    const countryMessages = getCountryMessages(locale);
    return Object.entries(countryMessages).map(([code, name]) => ({ code, name }));
  } catch (error) {
    console.warn(`Locale ${locale} not available, falling back to English`);
    const countryMessages = getCountryMessages('en');
    return Object.entries(countryMessages).map(([code, name]) => ({ code, name }));
  }
};

const getLanguageList = (locale = 'en'): Record<string, string>[] => {
  const primaryLanguageSubtag = locale.split('-')[0];

  try {
    const languageMessages = languages.getNames(primaryLanguageSubtag);
    return Object.entries(languageMessages).map(([code, name]) => ({ code, name }));
  } catch (error) {
    console.warn(`Locale ${primaryLanguageSubtag} not available, falling back to English`);
    const languageMessages = languages.getNames('en');
    return Object.entries(languageMessages).map(([code, name]) => ({ code, name }));
  }
};

export { getCountryList, getLanguageList };
