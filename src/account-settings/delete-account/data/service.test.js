import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '../../data/utils';

import { postDeleteAccount } from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('form-urlencoded');
jest.mock('../../data/utils');

describe('postDeleteAccount', () => {
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

  it('posts delete account request with password', async () => {
    const mockResponse = { data: { success: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postDeleteAccount('mypassword');

    expect(getConfig).toHaveBeenCalled();
    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(formurlencoded).toHaveBeenCalledWith({ password: 'mypassword' });

    expect(mockPost).toHaveBeenCalledWith(
      'http://testserver/api/user/v1/accounts/deactivate_logout/',
      'encoded:{"password":"mypassword"}',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('calls handleRequestError and throws when request fails', async () => {
    const mockError = new Error('Request failed');
    mockPost.mockRejectedValueOnce(mockError);

    handleRequestError.mockImplementation(() => {
      throw mockError;
    });

    await expect(postDeleteAccount('wrongpassword')).rejects.toThrow('Request failed');

    expect(handleRequestError).toHaveBeenCalledWith(mockError);
  });
});
