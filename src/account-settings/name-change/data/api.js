import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { handleRequestError } from '@src/account-settings/data/utils';

export async function postNameChange(name) {
  // Requests a pending name change, rather than saving the account name immediately
  const requestConfig = { headers: { Accept: 'application/json' } };
  const requestUrl = `${getSiteConfig().lmsBaseUrl}/api/user/v2/name_changes/`;

  const { data } = await getAuthenticatedHttpClient()
    .post(requestUrl, { name }, requestConfig)
    .catch(error => handleRequestError(error));

  return data;
}
