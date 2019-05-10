import { getAssumedServerLanguageCode } from '@edx/frontend-i18n'; // eslint-disable-line

import siteLanguageList from './constants';
import { snakeCaseObject, convertKeyNames } from '../common/utils';
import applyConfiguration from '../common/serviceUtils';

let config = {
  BASE_URL: null,
  PREFERENCES_API_BASE_URL: null,
  LMS_BASE_URL: null,
};

let apiClient = null;

export function configureApiService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

async function getSiteLanguageList() {
  return siteLanguageList;
}

async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    pref_lang: 'pref-lang',
  });

  await apiClient.patch(`${config.PREFERENCES_API_BASE_URL}/${username}`, processedParams, {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  });

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

async function postSetLang(code) {
  const formData = new FormData();
  formData.append('language', getAssumedServerLanguageCode(code));
  formData.append('next', `${config.BASE_URL}/account-settings`);

  await apiClient.post(`${config.LMS_BASE_URL}/i18n/setlang/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export const ApiService = {
  getSiteLanguageList,
  patchPreferences,
  postSetLang,
};
