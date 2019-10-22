import { App } from '@edx/frontend-base';

import { handleRequestError } from '../../../common/serviceUtils';

export async function getThirdPartyAuthProviders() {
  const { data } = await App.apiClient
    .get(`${App.config.LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${App.config.LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${App.config.LMS_BASE_URL}${disconnectUrl}`,
  }));
}

export async function postDisconnectAuth(url) {
  const { data } = await App.apiClient.post(url).catch(handleRequestError);
  return data;
}
