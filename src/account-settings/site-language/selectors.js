import { createSelector } from 'reselect';
import { getModuleState } from '../data/utils';

export const storePath = ['accountSettings', 'siteLanguage'];

const siteLanguageSelector = state => getModuleState(state, storePath);

export const siteLanguageListSelector = createSelector(
  siteLanguageSelector,
  siteLanguage => siteLanguage.siteLanguageList,
);

export const siteLanguageOptionsSelector = createSelector(
  siteLanguageSelector,
  siteLanguage => siteLanguage.siteLanguageList.map(({ code, name }) => ({
    value: code,
    label: name,
  })),
);
