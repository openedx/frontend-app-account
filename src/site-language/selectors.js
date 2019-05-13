import { createSelector } from 'reselect';

export const storeName = 'siteLanguageList';

const storeSelector = state => state[storeName];

export const siteLanguageListSelector = createSelector(
  storeSelector,
  siteLanguageListStore => siteLanguageListStore.siteLanguageList,
);

export const siteLanguageOptionsSelector = createSelector(
  siteLanguageListSelector,
  siteLanguageList => siteLanguageList.map(({ code, name }) => ({
    value: code,
    label: name,
  })),
);
