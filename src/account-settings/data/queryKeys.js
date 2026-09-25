const BASE_KEY = ['account-settings'];

export const accountSettingsKeys = {
  all: BASE_KEY,
  values: (username) => [...BASE_KEY, 'values', username],
  verifiedNameHistory: [...BASE_KEY, 'verified-name-history'],
  thirdPartyAuthProviders: [...BASE_KEY, 'third-party-auth-providers'],
  thirdPartyAuthError: [...BASE_KEY, 'third-party-auth-error'],
  profileDataManager: (username) => [...BASE_KEY, 'profile-data-manager', username],
  timeZones: [...BASE_KEY, 'time-zones'],
  countryTimeZones: (country) => [...BASE_KEY, 'time-zones', 'country', country ?? null],
  countries: [...BASE_KEY, 'countries'],
};

export const accountSettingsMutationKeys = {
  saveSettings: [...BASE_KEY, 'save-settings'],
  saveMultipleSettings: [...BASE_KEY, 'save-multiple-settings'],
  deleteAccount: [...BASE_KEY, 'delete-account'],
  resetPassword: [...BASE_KEY, 'reset-password'],
  requestNameChange: [...BASE_KEY, 'request-name-change'],
  disconnectAuth: [...BASE_KEY, 'disconnect-auth'],
};
