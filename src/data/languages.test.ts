import { getLanguageList, getLanguageMessages } from './languages';

describe('languages', () => {
  it('lists every language as a code and a localized name', () => {
    const languages = getLanguageList('es');

    expect(languages.length).toBeGreaterThan(100);
    expect(languages).toContainEqual({ code: 'en', name: 'Inglés' });
  });

  it('uses the primary language subtag of the locale', () => {
    expect(getLanguageMessages('pt-br').en).toBe('inglês');
  });

  it('falls back to English for a locale without a translation', () => {
    expect(getLanguageMessages('xx-yy').en).toBe('English');
  });
});
