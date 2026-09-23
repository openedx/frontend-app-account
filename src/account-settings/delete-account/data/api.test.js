import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import formurlencoded from 'form-urlencoded';
import { handleRequestError } from '@src/account-settings/data/utils';

import { postDeleteAccount } from '@src/account-settings/delete-account/data/api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  getSiteConfig: jest.fn(),
}));
jest.mock('form-urlencoded');
jest.mock('@src/account-settings/data/utils');

describe('postDeleteAccount', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://testserver' });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });

    formurlencoded.mockImplementation(obj => `encoded:${JSON.stringify(obj)}`);
  });

  it('posts delete account request with password', async () => {
    const mockResponse = { data: { success: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postDeleteAccount('mypassword');

    expect(getSiteConfig).toHaveBeenCalled();
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
