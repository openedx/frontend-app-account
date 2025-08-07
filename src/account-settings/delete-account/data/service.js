import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

/**
 * Request deletion of the user's account.
 */
// eslint-disable-next-line import/prefer-default-export
export async function postDeleteAccount(password) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getSiteConfig().LMS_BASE_URL}/api/user/v1/accounts/deactivate_logout/`,
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
