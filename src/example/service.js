import pick from 'lodash.pick';

let config = {
  ACCOUNTS_API_BASE_URL: null,
  ECOMMERCE_API_BASE_URL: null,
  LMS_BASE_URL: null,
};

let apiClient = null; // eslint-disable-line

function validateConfiguration(newConfig) {
  Object.keys(config).forEach((key) => {
    if (newConfig[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
}

export function configureApiService(newConfig, newApiClient) {
  validateConfiguration(newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

export async function getData(data) {
  // const { data } = await apiClient.get(`${config.API_BASE_URL}/example/`, {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
}
