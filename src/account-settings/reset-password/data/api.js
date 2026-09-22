import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

export async function postResetPassword(email) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getSiteConfig().lmsBaseUrl}/password_reset/`,
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
