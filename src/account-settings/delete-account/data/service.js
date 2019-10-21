import { App } from '@edx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { applyConfiguration, handleRequestError } from '../../../common/serviceUtils';

let config = {};

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
      `${App.config.LMS_BASE_URL}/api/user/v1/accounts/deactivate_logout/`,
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
