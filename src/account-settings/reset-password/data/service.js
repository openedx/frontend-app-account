import formurlencoded from 'form-urlencoded';
import { applyConfiguration, handleRequestError } from '../../../common/serviceUtils';

let config = {
  PASSWORD_RESET_URL: null,
};

let apiClient = null;

export function configureService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

export async function postResetPassword(email) {
  const { data } = await apiClient
    .post(
      config.PASSWORD_RESET_URL,
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
