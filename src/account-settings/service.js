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

export function configureApiService(newConfig, newApiClient) {
  validateConfiguration(newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

export async function getAccount() {
  // const { data } = await apiClient.get(`${config.API_BASE_URL}/example/`, {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    setTimeout(() => {
      resolve({
        fullname: 'Adam',
        email: 'staff@example.com',
        yearofbirth: 2019,
      });
    }, 200);
  });
}

export async function patchAccount(commitValues) {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    setTimeout(() => {
      // reject({
      //   fieldErrors: {
      //     [Object.keys(commitValues)[0]]: 'This is invalid'
      //   }
      // })
      resolve(commitValues);
    }, 200);
  });
}
