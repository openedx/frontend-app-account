import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

import { postVerifiedNameConfig } from '@src/account-settings/certificate-preference/data/api';
import { handleRequestError } from '@src/account-settings/data/utils';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  getSiteConfig: jest.fn(),
}));
jest.mock('@src/account-settings/data/utils');

describe('postVerifiedNameConfig', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://testserver' });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });
  });

  it('posts verified name config with useVerifiedNameForCerts = true', async () => {
    const mockResponse = { data: { success: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postVerifiedNameConfig('testuser', { useVerifiedNameForCerts: true });

    expect(getSiteConfig).toHaveBeenCalled();
    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith(
      'http://testserver/api/edx_name_affirmation/v1/verified_name/config',
      {
        username: 'testuser',
        use_verified_name_for_certs: true,
      },
      { headers: { Accept: 'application/json' } },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('posts verified name config with useVerifiedNameForCerts = false', async () => {
    const mockResponse = { data: { success: false } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postVerifiedNameConfig('anotheruser', { useVerifiedNameForCerts: false });

    expect(mockPost).toHaveBeenCalledWith(
      'http://testserver/api/edx_name_affirmation/v1/verified_name/config',
      {
        username: 'anotheruser',
        use_verified_name_for_certs: false,
      },
      { headers: { Accept: 'application/json' } },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('calls handleRequestError and throws when request fails', async () => {
    const mockError = new Error('Request failed');
    mockPost.mockRejectedValueOnce(mockError);

    handleRequestError.mockImplementation(() => {
      throw mockError;
    });

    await expect(
      postVerifiedNameConfig('erroruser', { useVerifiedNameForCerts: true }),
    ).rejects.toThrow('Request failed');

    expect(handleRequestError).toHaveBeenCalledWith(mockError);
  });
});
