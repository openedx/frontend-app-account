import { App } from '@edx/frontend-base';
import siteLanguageList from './constants';
import { snakeCaseObject, convertKeyNames } from '../data/utils';

export async function getSiteLanguageList() {
  return siteLanguageList;
}

export async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    pref_lang: 'pref-lang',
  });

  await App.apiClient.patch(`${App.config.LMS_BASE_URL}/api/user/v1/preferences/${username}`, processedParams, {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  });

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

export async function postSetLang(code) {
  const formData = new FormData();
  formData.append('language', code);

  await App.apiClient.post(`${App.config.LMS_BASE_URL}/i18n/setlang/`, formData, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
}
