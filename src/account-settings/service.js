import pick from 'lodash.pick';

let config = {
  ACCOUNTS_API_BASE_URL: null,
  ECOMMERCE_API_BASE_URL: null,
  LMS_BASE_URL: null,
  PASSWORD_RESET_URL: null,
};

let apiClient = null; // eslint-disable-line no-unused-vars

function validateConfiguration(newConfig) {
  Object.keys(config).forEach((key) => {
    if (newConfig[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
}

function handleRequestError(error) {
  if (error.response && error.response.data.field_errors) {
    const apiError = Object.create(error);
    apiError.fieldErrors = Object.entries(error.response.data.field_errors)
      .reduce((acc, [k, v]) => {
        acc[k] = v.user_message;
        return acc;
      }, {});

    throw apiError;
  }
  throw error;
}

export function configureApiService(newConfig, newApiClient) {
  validateConfiguration(newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

export async function getAccount(username) {
  const { data } = await apiClient.get(`${config.ACCOUNTS_API_BASE_URL}/${username}`);

  return data;
}

export async function patchAccount(username, commitValues) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  };

  const { data } = await apiClient.patch(
    `${config.ACCOUNTS_API_BASE_URL}/${username}`,
    commitValues,
    requestConfig,
  ).catch(handleRequestError);

  return data;
}

export async function postResetPassword() {
  const { data } = await apiClient
    .post(config.PASSWORD_RESET_URL)
    .catch(handleRequestError);

  return data;
}


export async function getThirdPartyAuthProviders() {
  const { data } = await apiClient.get(`${config.LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${config.LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${config.LMS_BASE_URL}${disconnectUrl}`,
  }));
}
