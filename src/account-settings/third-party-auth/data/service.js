import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { handleRequestError } from '../../data/utils';

export async function getThirdPartyAuthProviders() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getSiteConfig().lmsBaseUrl}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${getSiteConfig().lmsBaseUrl}${connectUrl}`,
    disconnectUrl: `${getSiteConfig().lmsBaseUrl}${disconnectUrl}`,
  }));
}

export async function postDisconnectAuth(url) {
  const requestConfig = { headers: { Accept: 'application/json' } };
  const { data } = await getAuthenticatedHttpClient()
    .post(url, {}, requestConfig)
    .catch(handleRequestError);
  return data;
}
