import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';

// eslint-disable-next-line import/prefer-default-export
export async function forgotPassword(email) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/account/password`,
      formurlencoded({ email }),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return data;
}
