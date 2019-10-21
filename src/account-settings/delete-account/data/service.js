import { App } from '@edx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../../common/serviceUtils';

/**
 * Request deletion of the user's account.
 */
export default async function postDeleteAccount(password) {
  const { data } = await App.apiClient
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
