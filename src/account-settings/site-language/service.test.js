import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertKeyNames, snakeCaseObject } from '@edx/frontend-platform/utils';

import { getSiteLanguageList, patchPreferences, postSetLang } from './service';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform/utils');
jest.mock('./constants', () => (['en', 'es', 'fr']));

describe('preferencesApi', () => {
  const mockPatch = jest.fn();
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getConfig.mockReturnValue({
      LMS_BASE_URL: 'http://testserver',
    });

    getAuthenticatedHttpClient.mockReturnValue({
      patch: mockPatch,
      post: mockPost,
    });

    snakeCaseObject.mockImplementation(obj => obj);
    convertKeyNames.mockImplementation((obj) => obj);
  });

  describe('getSiteLanguageList', () => {
    it('returns the siteLanguageList constant', async () => {
      const result = await getSiteLanguageList();
      expect(result).toEqual(['en', 'es', 'fr']);
    });
  });

  describe('patchPreferences', () => {
    it('patches preferences with processed params and returns the original params', async () => {
      const username = 'testuser';
      const params = { prefLang: 'en', darkMode: true };
      const processed = { 'pref-lang': 'en', dark_mode: true };

      // Mock conversions
      snakeCaseObject.mockReturnValueOnce({ pref_lang: 'en', dark_mode: true });
      convertKeyNames.mockReturnValueOnce(processed);

      mockPatch.mockResolvedValueOnce({ data: { success: true } });

      const result = await patchPreferences(username, params);

      expect(snakeCaseObject).toHaveBeenCalledWith(params);
      expect(convertKeyNames).toHaveBeenCalledWith(
        { pref_lang: 'en', dark_mode: true },
        { pref_lang: 'pref-lang' },
      );

      expect(mockPatch).toHaveBeenCalledWith(
        'http://testserver/api/user/v1/preferences/testuser',
        processed,
        {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        },
      );

      expect(result).toEqual(params);
    });
  });

  describe('postSetLang', () => {
    it('posts language selection via FormData', async () => {
      const mockResponse = { data: { success: true } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const appendSpy = jest.spyOn(FormData.prototype, 'append');

      await postSetLang('fr');

      expect(appendSpy).toHaveBeenCalledWith('language', 'fr');
      expect(mockPost).toHaveBeenCalledWith(
        'http://testserver/i18n/setlang/',
        expect.any(FormData),
        {
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );

      appendSpy.mockRestore();
    });
  });
});
