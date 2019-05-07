import { AsyncActionType } from '../common/utils';

export const FETCH_SITE_LANGUAGES = new AsyncActionType('SITE_LANGUAGE', 'FETCH_SITE_LANGUAGES');

export const fetchSiteLanguages = () => ({
  type: FETCH_SITE_LANGUAGES.BASE,
});

export const fetchSiteLanguagesBegin = () => ({
  type: FETCH_SITE_LANGUAGES.BEGIN,
});

export const fetchSiteLanguagesSuccess = languages => ({
  type: FETCH_SITE_LANGUAGES.SUCCESS,
  payload: { languages },
});

export const fetchSiteLanguagesFailure = error => ({
  type: FETCH_SITE_LANGUAGES.FAILURE,
  payload: { error },
});

export const fetchSiteLanguagesReset = () => ({
  type: FETCH_SITE_LANGUAGES.RESET,
});
