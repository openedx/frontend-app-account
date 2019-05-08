import { createSelector } from 'reselect';

export const storeName = 'siteLanguage';

const siteLanguageSelector = state => state[storeName];

const languagesSelector = createSelector(
  siteLanguageSelector,
  siteLanguage => siteLanguage.languages,
);

export const siteLanguageOptionsSelector = createSelector(
  languagesSelector,
  languages => languages.map(({ code, name }) => ({
    value: code,
    label: name,
  })),
);
