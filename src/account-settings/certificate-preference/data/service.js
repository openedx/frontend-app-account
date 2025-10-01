import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { handleRequestError } from '../../data/utils';

export async function postVerifiedNameConfig(username, commitValues) {
  const requestConfig = { headers: { Accept: 'application/json' } };
  const requestUrl = `${getSiteConfig().lmsBaseUrl}/api/edx_name_affirmation/v1/verified_name/config`;

  const { useVerifiedNameForCerts } = commitValues;
  const postValues = {
    username,
    use_verified_name_for_certs: useVerifiedNameForCerts,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(requestUrl, postValues, requestConfig)
    .catch(error => handleRequestError(error));

  return data;
}
