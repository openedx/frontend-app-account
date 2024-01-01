import { profileDataManagerSelector } from './selectors';

const testValue = 'test VALUE';

describe('profileDataManagerSelector', () => {
  it('returns the profileDataManager from the state', () => {
    const state = {
      accountSettings: {
        profileDataManager: { testValue },
      },
    };
    const result = profileDataManagerSelector(state);

    expect(result).toEqual(state.accountSettings.profileDataManager);
  });
});
