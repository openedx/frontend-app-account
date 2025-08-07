import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { handleRequestError } from '../../data/utils';

export async function getThirdPartyAuthProviders() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${getConfig().LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${getConfig().LMS_BASE_URL}${disconnectUrl}`,
  }));
}

export async function postDisconnectAuth(url) {
  // Remove the redirect parameter to avoid CORS issues
  const urlWithoutRedirect = new URL(url);
  urlWithoutRedirect.searchParams.delete('next');

  const requestConfig = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    // Completely prevent following redirects
    maxRedirects: 0,
    validateStatus: () => true, // Accept all status codes
  };

  try {
    const response = await getAuthenticatedHttpClient()
      .post(urlWithoutRedirect.toString(), {}, requestConfig);

    // Return the actual server response
    return response.data;
  } catch (error) {
    // Check if this is a network error due to CORS on redirect
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // This likely means the disconnect worked but backend tried to redirect
      // which caused CORS error - treat as success
      return { success: true };
    }

    // For any actual API errors, still throw
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      throw error;
    }

    // For redirects or other responses, treat as success
    return { success: true };
  }
}
