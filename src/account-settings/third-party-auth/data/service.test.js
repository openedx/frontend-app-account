import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getThirdPartyAuthError } from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
};

getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
getConfig.mockReturnValue({ LMS_BASE_URL: 'http://lms.test' });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('third party auth service', () => {
  describe('getThirdPartyAuthError', () => {
    it('returns the pending user message', async () => {
      const userMessage = 'The Google account you selected is already linked to another edX account.';
      mockHttpClient.get.mockResolvedValue({ data: { user_message: userMessage } });

      const result = await getThirdPartyAuthError();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://lms.test/api/user/v1/accounts/third_party_auth_error/',
      );
      expect(result).toEqual(userMessage);
    });

    it('returns null when there is no pending message', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { user_message: '' } });

      expect(await getThirdPartyAuthError()).toBeNull();
    });

    it('returns null when the request fails', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('not found'));

      expect(await getThirdPartyAuthError()).toBeNull();
    });
  });
});
