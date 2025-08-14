import { convertKeyNames, getAuthenticatedHttpClient, getSiteConfig, snakeCaseObject, getSupportedLanguageList } from '@openedx/frontend-base';

export async function getSiteLanguageList() {
  return getSupportedLanguageList();
}

export async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    pref_lang: 'pref-lang',
  });

  await getAuthenticatedHttpClient()
    .patch(`${getSiteConfig().lmsBaseUrl}/api/user/v1/preferences/${username}`, processedParams, {
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
  const url = `${getSiteConfig().lmsBaseUrl}/i18n/setlang/`;
  formData.append('language', code);

  await getAuthenticatedHttpClient()
    .post(url, formData, requestConfig);
}
