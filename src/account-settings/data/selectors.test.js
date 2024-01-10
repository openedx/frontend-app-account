import { profileDataManagerSelector, formValuesSelector } from './selectors';

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

  it('should correctly select form values', () => {
    const state = {
      accountSettings: {
        values: {
          name: 'John Doe',
          age: 25,
        },
        drafts: {
          age: 26,

        },
        verifiedNameHistory: 'test',
        confirmationValues: {},
      },
    };

    const result = formValuesSelector(state);

    const expected = {
      name: 'John Doe',
      age: 26,
      verified_name: '',
      useVerifiedNameForCerts: false,
    };

    expect(result).toEqual(expected);
  });

  it('should correctly select form values with extended_profile', () => {
    // Mock data with extended_profile field in both values and drafts
    const state = {
      accountSettings: {
        values: {
          extended_profile: [
            { field_name: 'test_field', field_value: '5' },
          ],
        },
        drafts: { test_field: '6' },
        verifiedNameHistory: 'test',
        confirmationValues: {},
      },
    };

    const result = formValuesSelector(state);

    const expected = {
      verified_name: '',
      useVerifiedNameForCerts: false,
      extended_profile: [ // Draft value should override the committed value
        { field_name: 'test_field', field_value: '6' }, // Value from the committed values
      ],
    };

    expect(result).toEqual(expected);
  });
});
