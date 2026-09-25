import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { handleRequestError } from '../../data/utils';

export async function getThirdPartyAuthProviders() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${getConfig().LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${getConfig().LMS_BASE_URL}${disconnectUrl}`,
  }));
}

/**
 * Retrieve the error message, if any, that the LMS recorded for the last failed third-party auth
 * attempt (e.g. trying to link a provider account that is already linked to another account).
 *
 * The message is consumed on read, so it is only ever returned once. A missing or failing endpoint
 * is not fatal: the rest of the account settings page must still render.
 */
export async function getThirdPartyAuthError() {
  try {
    const { data } = await getAuthenticatedHttpClient()
      .get(`${getConfig().LMS_BASE_URL}/api/user/v1/accounts/third_party_auth_error/`);

    return data.user_message || null;
  } catch (error) {
    return null;
  }
}

export async function postDisconnectAuth(url) {
  const requestConfig = { headers: { Accept: 'application/json' } };
  const { data } = await getAuthenticatedHttpClient()
    .post(url, {}, requestConfig)
    .catch(handleRequestError);
  return data;
}
