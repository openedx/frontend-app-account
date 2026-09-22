import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { getThirdPartyAuthError } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  getSiteConfig: jest.fn(),
}));

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
};

getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://lms.test' });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('third party auth API', () => {
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
