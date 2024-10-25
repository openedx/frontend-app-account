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

export async function postDisconnectAuth(url) {
  const requestConfig = { headers: { Accept: 'application/json' } };
  const { data } = await getAuthenticatedHttpClient()
    .post(url, {}, requestConfig)
    .catch(handleRequestError);
  return data;
}
