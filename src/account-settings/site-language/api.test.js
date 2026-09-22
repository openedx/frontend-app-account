import {
  getAuthenticatedHttpClient,
  convertKeyNames,
  snakeCaseObject,
  getSiteConfig,
} from '@openedx/frontend-base';

import { patchPreferences, postSetLang } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
  convertKeyNames: jest.fn(),
  snakeCaseObject: jest.fn(),
  getSiteConfig: jest.fn(),
}));

describe('site language API', () => {
  const mockPatch = jest.fn();
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://testserver' });

    getAuthenticatedHttpClient.mockReturnValue({
      patch: mockPatch,
      post: mockPost,
    });

    snakeCaseObject.mockImplementation(obj => obj);
    convertKeyNames.mockImplementation((obj) => obj);
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
