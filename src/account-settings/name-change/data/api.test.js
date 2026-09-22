import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { handleRequestError } from '../../data/utils';

import { postNameChange } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  getSiteConfig: jest.fn(),
}));
jest.mock('../../data/utils');

describe('postNameChange', () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://testserver' });

    getAuthenticatedHttpClient.mockReturnValue({
      post: mockPost,
    });
  });

  it('posts a name change request successfully', async () => {
    const mockResponse = { data: { success: true, updated: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postNameChange('New Name');

    expect(getSiteConfig).toHaveBeenCalled();
    expect(getAuthenticatedHttpClient).toHaveBeenCalled();

    expect(mockPost).toHaveBeenCalledWith(
      'http://testserver/api/user/v1/accounts/name_change/',
      { name: 'New Name' },
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

    await expect(postNameChange('Bad Name')).rejects.toThrow('Request failed');

    expect(handleRequestError).toHaveBeenCalledWith(mockError);
  });
});
