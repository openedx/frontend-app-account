import { App } from '@edx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { applyConfiguration, handleRequestError } from '../../../common/serviceUtils';

let config = {};

let apiClient = null;

export function configureService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

export async function postResetPassword(email) {
  const { data } = await apiClient
    .post(
      `${App.config.LMS_BASE_URL}/password_reset/`,
      formurlencoded({ email }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .catch(handleRequestError);

  return data;
}
