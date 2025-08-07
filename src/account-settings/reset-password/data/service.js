import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

// eslint-disable-next-line import/prefer-default-export
export async function postResetPassword(email) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getSiteConfig().LMS_BASE_URL}/password_reset/`,
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
