import { applyConfiguration, handleRequestError } from '../../../common/serviceUtils';

let config = {
  LMS_BASE_URL: null,
};

let apiClient = null;

export function configureService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

export async function getThirdPartyAuthProviders() {
  const { data } = await apiClient
    .get(`${config.LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${config.LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${config.LMS_BASE_URL}${disconnectUrl}`,
  }));
}

export async function postDisconnectAuth(url) {
  const { data } = await apiClient.post(url).catch(handleRequestError);
  return data;
}
