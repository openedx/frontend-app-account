import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertKeyNames, snakeCaseObject } from '@edx/frontend-platform/utils';
import siteLanguageList from './constants';

export async function getSiteLanguageList() {
  return siteLanguageList;
}

export async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    pref_lang: 'pref-lang',
  });

  await getAuthenticatedHttpClient()
    .patch(`${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`, processedParams, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    });

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

export async function postSetLang(code) {
  const formData = new FormData();
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  const url = `${getConfig().LMS_BASE_URL}/i18n/setlang/`;
  formData.append('language', code);

  await getAuthenticatedHttpClient()
    .post(url, formData, requestConfig);
}
