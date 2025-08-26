import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { FIELD_LABELS } from './constants';
import {
  getAccount,
  patchAccount,
  getPreferences,
  patchPreferences,
  getTimeZones,
  getProfileDataManager,
  getVerifiedName,
  getVerifiedNameHistory,
  postVerifiedName,
  getCountryList,
  patchSettings,
} from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform/logging');

const mockHttpClient = {
  get: jest.fn(),
  patch: jest.fn(),
  post: jest.fn(),
};

getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
getConfig.mockReturnValue({ LMS_BASE_URL: 'http://lms.test' });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('account service', () => {
  describe('getAccount', () => {
    it('returns unpacked account data', async () => {
      const apiResponse = {
        username: 'testuser',
        social_links: [{ platform: 'twitter', social_link: 'http://t' }],
        language_proficiencies: [{ code: 'en' }],
      };
      mockHttpClient.get.mockResolvedValue({ data: apiResponse });

      const result = await getAccount('testuser');
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://lms.test/api/user/v1/accounts/testuser');
      expect(result.social_link_twitter).toEqual('http://t');
      expect(result.language_proficiencies).toEqual('en');
    });
  });

  describe('patchAccount', () => {
    it('sends packed commit data and returns unpacked response', async () => {
      const commit = { social_link_twitter: 'http://t' };
      const apiResponse = {
        username: 'testuser',
        social_links: [{ platform: 'twitter', social_link: 'http://t' }],
        language_proficiencies: [],
      };
      mockHttpClient.patch.mockResolvedValue({ data: apiResponse });

      const result = await patchAccount('testuser', commit);
      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        'http://lms.test/api/user/v1/accounts/testuser',
        expect.objectContaining({ social_links: [{ platform: 'twitter', social_link: 'http://t' }] }),
        expect.any(Object),
      );
      expect(result.social_link_twitter).toEqual('http://t');
    });
  });

  describe('getPreferences', () => {
    it('returns preferences data', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { theme: 'dark' } });
      const result = await getPreferences('user');
      expect(result.theme).toBe('dark');
    });
  });

  describe('patchPreferences', () => {
    it('patches preferences and returns commitValues', async () => {
      mockHttpClient.patch.mockResolvedValue({});
      const commit = { time_zone: 'UTC' };
      const result = await patchPreferences('user', commit);
      expect(mockHttpClient.patch).toHaveBeenCalled();
      expect(result).toEqual(commit);
    });
  });

  describe('getTimeZones', () => {
    it('returns data from API', async () => {
      mockHttpClient.get.mockResolvedValue({ data: ['UTC', 'PST'] });
      const result = await getTimeZones('PK');
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://lms.test/user_api/v1/preferences/time_zones/',
        { params: { country_code: 'PK' } },
      );
      expect(result).toEqual(['UTC', 'PST']);
    });
  });

  describe('getProfileDataManager', () => {
    it('returns null if no enterprise manages profile', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { results: [] } });
      const result = await getProfileDataManager('user', ['learner']);
      expect(result).toBeNull();
    });

    it('returns enterprise name if sync is enabled', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { results: [{ enterprise_customer: { name: 'Acme', sync_learner_profile_data: true } }] } });
      const result = await getProfileDataManager('user', ['enterprise_learner']);
      expect(result).toBe('Acme');
    });
  });

  describe('getVerifiedName', () => {
    it('returns verified name data', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { verified: true } });
      const result = await getVerifiedName();
      expect(result.verified).toBe(true);
    });

    it('returns {} on error', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('fail'));
      const result = await getVerifiedName();
      expect(result).toEqual({});
    });
  });

  describe('getVerifiedNameHistory', () => {
    it('returns verified name history data', async () => {
      mockHttpClient.get.mockResolvedValue({ data: [{ id: 1 }] });
      const result = await getVerifiedNameHistory();
      expect(result[0].id).toBe(1);
    });
  });

  describe('postVerifiedName', () => {
    it('posts verified name data', async () => {
      mockHttpClient.post.mockResolvedValue({});
      await postVerifiedName({ first_name: 'A' });
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'http://lms.test/api/edx_name_affirmation/v1/verified_name',
        { first_name: 'A' },
        { headers: { Accept: 'application/json' } },
      );
    });
  });

  describe('getCountryList', () => {
    it('extracts country values from registration API', async () => {
      const apiResponse = { fields: [{ name: FIELD_LABELS.COUNTRY, options: [{ value: 'PK' }] }] };
      mockHttpClient.get.mockResolvedValue({ data: apiResponse });
      const result = await getCountryList();
      expect(result).toEqual(['PK']);
    });

    it('returns [] and logs error on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('fail'));
      const result = await getCountryList();
      expect(result).toEqual([]);
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('patchSettings', () => {
    it('calls patchAccount and patchPreferences as needed', async () => {
      mockHttpClient.patch.mockResolvedValue({
        data: {
          username: 'user',
          social_links: [],
          language_proficiencies: [],
        },
      });

      const result = await patchSettings('user', { time_zone: 'UTC', social_link_twitter: 't' });
      expect(result.username).toBe('user');
    });
  });
});
