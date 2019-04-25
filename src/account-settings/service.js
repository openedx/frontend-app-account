import pick from 'lodash.pick';

let config = {
  ACCOUNTS_API_BASE_URL: null,
  ECOMMERCE_API_BASE_URL: null,
  LMS_BASE_URL: null,
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
  if (error.response) {
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
