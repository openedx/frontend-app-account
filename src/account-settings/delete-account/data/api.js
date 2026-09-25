import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

/**
 * Request deletion of the user's account.
 */
// eslint-disable-next-line import/prefer-default-export
export async function postDeleteAccount(password) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/deactivate_logout/`,
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
