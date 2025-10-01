import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { handleRequestError } from '../../data/utils';

export async function postNameChange(name) {
  // Requests a pending name change, rather than saving the account name immediately
  const requestConfig = { headers: { Accept: 'application/json' } };
  const requestUrl = `${getSiteConfig().lmsBaseUrl}/api/user/v1/accounts/name_change/`;

  const { data } = await getAuthenticatedHttpClient()
    .post(requestUrl, { name }, requestConfig)
    .catch(error => handleRequestError(error));

  return data;
}
