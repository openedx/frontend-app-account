import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { handleRequestError } from '../../data/utils';

// eslint-disable-next-line import/prefer-default-export
export async function postNameChange(name, firstName, lastName) {
  // Requests a pending name change, rather than saving the account name immediately
  const requestConfig = { headers: { Accept: 'application/json' } };
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/name_change/`;

  const nameChangePayload = { name };
  if (firstName && lastName) {
    nameChangePayload.first_name = firstName;
    nameChangePayload.last_name = lastName;
  }

  const { data } = await getAuthenticatedHttpClient()
    .post(requestUrl, nameChangePayload, requestConfig)
    .catch(error => handleRequestError(error));

  return data;
}
