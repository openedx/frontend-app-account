import { AsyncActionType } from '../data/utils';

export const FETCH_SITE_LANGUAGES = new AsyncActionType('SITE_LANGUAGE', 'FETCH_SITE_LANGUAGES');

export const fetchSiteLanguages = handleNavigation => ({
  type: FETCH_SITE_LANGUAGES.BASE,
  payload: { handleNavigation },
});

export const fetchSiteLanguagesBegin = () => ({
  type: FETCH_SITE_LANGUAGES.BEGIN,
});

export const fetchSiteLanguagesSuccess = siteLanguageList => ({
  type: FETCH_SITE_LANGUAGES.SUCCESS,
  payload: { siteLanguageList },
});

export const fetchSiteLanguagesFailure = error => ({
  type: FETCH_SITE_LANGUAGES.FAILURE,
  payload: { error },
});

export const fetchSiteLanguagesReset = () => ({
  type: FETCH_SITE_LANGUAGES.RESET,
});
