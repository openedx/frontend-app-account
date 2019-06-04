import formurlencoded from 'form-urlencoded';
import { applyConfiguration, handleRequestError } from '../../../common/serviceUtils';

let config = {
  DELETE_ACCOUNT_URL: null,
};

let apiClient = null;

export function configureService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

/**
 * Request deletion of the user's account.
 */
export async function postDeleteAccount(password) {
  const { data } = await apiClient
    .post(
      config.DELETE_ACCOUNT_URL,
      formurlencoded({ password }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .catch(handleRequestError);
  return data;
}
