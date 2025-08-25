import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { handleRequestError } from '../../data/utils';

import { postNameChange } from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('../../data/utils');

describe('postNameChange', () => {
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

  it('posts a name change request successfully', async () => {
    const mockResponse = { data: { success: true, updated: true } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await postNameChange('New Name');

    expect(getConfig).toHaveBeenCalled();
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
