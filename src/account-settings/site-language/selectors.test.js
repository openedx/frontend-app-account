import { siteLanguageListSelector, siteLanguageOptionsSelector, storePath } from './selectors';

const buildState = siteLanguageList => ({
  accountSettings: {
    siteLanguage: { siteLanguageList },
  },
});

describe('siteLanguageListSelector', () => {
  it('returns the raw site language list unchanged', () => {
    const siteLanguageList = [
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
    ];
    const state = buildState(siteLanguageList);

    expect(siteLanguageListSelector(state)).toEqual(siteLanguageList);
  });
});

describe('siteLanguageOptionsSelector', () => {
  it('sorts the options by display name', () => {
    const state = buildState([
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
      { code: 'en', name: 'English' },
      { code: 'es-419', name: 'Español (Latinoamérica)' },
    ]);

    expect(siteLanguageOptionsSelector(state)).toEqual([
      { value: 'en', label: 'English' },
      { value: 'es-419', label: 'Español (Latinoamérica)' },
      { value: 'fr', label: 'Français' },
      { value: 'ar', label: 'العربية' },
    ]);
  });

  it('does not mutate the underlying site language list', () => {
    const siteLanguageList = [
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
    ];
    const state = buildState(siteLanguageList);

    siteLanguageOptionsSelector(state);

    expect(siteLanguageList).toEqual([
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
    ]);
  });
});

describe('storePath', () => {
  it('points at the siteLanguage module state', () => {
    expect(storePath).toEqual(['accountSettings', 'siteLanguage']);
  });
});
