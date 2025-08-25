import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

import { postResetPassword } from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('form-urlencoded');
jest.mock('../../data/utils');

describe('postResetPassword', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getConfig.mockReturnValue({
      LMS_BASE_URL: 'http://testserver',
    });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });

    formurlencoded.mockImplementation(obj => `encoded:${JSON.stringify(obj)}`);
  });

  it('posts reset password request with email', async () => {
    const mockResponse = { data: { success: true, email_sent: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postResetPassword('user@example.com');

    expect(getConfig).toHaveBeenCalled();
    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(formurlencoded).toHaveBeenCalledWith({ email: 'user@example.com' });

    expect(mockPost).toHaveBeenCalledWith(
      'http://testserver/password_reset/',
      'encoded:{"email":"user@example.com"}',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('calls handleRequestError and throws when request fails', async () => {
    const mockError = new Error('Reset password failed');
    mockPost.mockRejectedValueOnce(mockError);

    handleRequestError.mockImplementation(() => {
      throw mockError;
    });

    await expect(postResetPassword('bad@example.com')).rejects.toThrow('Reset password failed');

    expect(handleRequestError).toHaveBeenCalledWith(mockError);
  });
});
