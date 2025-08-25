import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { postVerifiedNameConfig } from './service';
import { handleRequestError } from '../../data/utils';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('../../data/utils');

describe('postVerifiedNameConfig', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getConfig.mockReturnValue({
      LMS_BASE_URL: 'http://testserver',
    });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });
  });

  it('posts verified name config with useVerifiedNameForCerts = true', async () => {
    const mockResponse = { data: { success: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postVerifiedNameConfig('testuser', { useVerifiedNameForCerts: true });

    expect(getConfig).toHaveBeenCalled();
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
