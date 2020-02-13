import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export default async function postNewUser(registrationInformation) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  console.log('rickie is fucken baller');
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}user_api/v1/account/registration/`,
      registrationInformation,
      requestConfig,
    )
    .catch((e) => {
      console.log('You messed up');
      throw (e);
    });

  return data;
}
