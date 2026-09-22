import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

import { postResetPassword } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  getSiteConfig: jest.fn(),
}));
jest.mock('form-urlencoded');
jest.mock('../../data/utils');

describe('postResetPassword', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://testserver' });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });

    formurlencoded.mockImplementation(obj => `encoded:${JSON.stringify(obj)}`);
  });

  it('posts reset password request with email', async () => {
    const mockResponse = { data: { success: true, email_sent: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postResetPassword('user@example.com');

    expect(getSiteConfig).toHaveBeenCalled();
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
