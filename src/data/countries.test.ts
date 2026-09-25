import { getCountryList, getCountryMessages } from '@src/data/countries';

describe('countries', () => {
  it('lists every country as a code and a localized name', () => {
    const countries = getCountryList('es');

    expect(countries.length).toBeGreaterThan(200);
    expect(countries).toContainEqual({ code: 'BR', name: 'Brasil' });
  });

  it('uses the primary language subtag of the locale', () => {
    expect(getCountryMessages('pt-br').BR).toBe('Brasil');
    expect(getCountryMessages('fr-ca').US).toBe("États-Unis d'Amérique");
  });

  it('falls back to English for a locale without a translation', () => {
    expect(getCountryMessages('xx-yy').US).toBe('United States of America');
  });
});
