import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';
import querystring from 'querystring';

export async function postNewUser(registrationInformation) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/user_api/v1/account/registration/`,
      querystring.stringify(registrationInformation),
      requestConfig,
    )
    .catch((e) => {
      console.log('You messed up');
      throw (e);
    });

  return data;
}

export async function login(creds) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/user_api/v1/account/registration/`,
      creds,
      requestConfig,
    )
    .catch((e) => {
      console.log('You messed up');
      throw (e);
    });

  return data;
}
