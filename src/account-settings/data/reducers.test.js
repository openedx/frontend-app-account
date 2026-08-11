import reducer, { defaultState } from './reducers';
import { fetchSettingsSuccess } from './actions';

const successPayload = (overrides = {}) => ({
  values: {},
  thirdPartyAuthProviders: [],
  thirdPartyAuthError: null,
  profileDataManager: null,
  timeZones: [],
  verifiedNameHistory: {},
  countriesCodesList: [],
  ...overrides,
});

describe('accountSettings reducer', () => {
  describe('FETCH_SETTINGS.SUCCESS', () => {
    it('stores the third-party auth error message', () => {
      const state = reducer(
        defaultState,
        fetchSettingsSuccess(successPayload({ thirdPartyAuthError: 'Already linked.' })),
      );

      expect(state.thirdPartyAuthError).toEqual('Already linked.');
    });

    it('keeps an already fetched message when a later fetch returns none', () => {
      // The LMS consumes the message on read, so a second fetch legitimately returns null. The
      // message must survive it, otherwise StrictMode's double mount hides the alert entirely.
      const firstFetch = reducer(
        defaultState,
        fetchSettingsSuccess(successPayload({ thirdPartyAuthError: 'Already linked.' })),
      );
      const secondFetch = reducer(firstFetch, fetchSettingsSuccess(successPayload()));

      expect(secondFetch.thirdPartyAuthError).toEqual('Already linked.');
    });

    it('leaves the message null when there is none pending', () => {
      const state = reducer(defaultState, fetchSettingsSuccess(successPayload()));

      expect(state.thirdPartyAuthError).toBeNull();
    });
  });
});
