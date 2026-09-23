import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

import { getAuthenticatedUser } from '@openedx/frontend-base';

import { createTestQueryClient, createWrapper } from '@src/tests/renderWithProviders';
import {
  getAccount,
  getCountryList,
  getPreferences,
  getProfileDataManager,
  getTimeZones,
  getVerifiedNameHistory,
} from '@src/account-settings/data/api';
import { getThirdPartyAuthError, getThirdPartyAuthProviders } from '@src/account-settings/third-party-auth/data/api';
import { AccountSettingsFormProvider } from '@src/account-settings/data/FormContext';
import { useAccountSettingsData, useThirdPartyAuthError } from '@src/account-settings/data/hooks';
import { accountSettingsKeys } from '@src/account-settings/data/queryKeys';

jest.mock('@src/account-settings/data/api');
jest.mock('@src/account-settings/third-party-auth/data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(),
}));

const user = { username: 'edx', userId: 3, roles: ['enterprise_learner:acme'] };

const timeZone = { time_zone: 'America/New_York', description: 'New York (EST)' };

const createFormWrapper = (queryClient = createTestQueryClient()) => {
  const Providers = createWrapper({ queryClient });
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <Providers>
      <AccountSettingsFormProvider>{children}</AccountSettingsFormProvider>
    </Providers>
  );
  return Wrapper;
};

const renderData = (queryClient) => renderHook(
  () => useAccountSettingsData(),
  { wrapper: createFormWrapper(queryClient) },
);

describe('useAccountSettingsData', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue(user);
    getAccount.mockResolvedValue({ username: 'edx', name: 'Ed X', country: 'US' });
    getPreferences.mockResolvedValue({ time_zone: 'America/New_York' });
    getVerifiedNameHistory.mockResolvedValue({
      use_verified_name_for_certs: true,
      results: [{ verified_name: 'Edward X', status: 'approved', created: '2023-01-01T00:00:00Z' }],
    });
    getThirdPartyAuthProviders.mockResolvedValue([{ id: 'oa2-google-oauth2', connected: false }]);
    getThirdPartyAuthError.mockResolvedValue(null);
    getProfileDataManager.mockResolvedValue('Acme Corp');
    getTimeZones.mockResolvedValue([timeZone]);
    getCountryList.mockResolvedValue(['US', 'BR']);
  });

  afterEach(() => jest.clearAllMocks());

  it('is pending until every query has resolved, then exposes the derived page data', async () => {
    const { result } = renderData();

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.committedValues).toEqual({
      username: 'edx',
      name: 'Ed X',
      country: 'US',
      time_zone: 'America/New_York',
      verified_name: 'Edward X',
      useVerifiedNameForCerts: true,
    });
    expect(result.current.formValues).toEqual(result.current.committedValues);
    expect(result.current.verifiedName.verified_name).toBe('Edward X');
    expect(result.current.mostRecentVerifiedName.verified_name).toBe('Edward X');
    expect(result.current.staticFields).toEqual(['name', 'email', 'country']);
    expect(result.current.profileDataManager).toBe('Acme Corp');
    expect(result.current.tpaProviders).toEqual([{ id: 'oa2-google-oauth2', connected: false }]);
    expect(result.current.thirdPartyAuthError).toBeNull();
    expect(result.current.countriesCodesList).toEqual(['US', 'BR']);
    expect(result.current.timeZoneOptions).toEqual([{ value: 'America/New_York', label: 'New York (EST)' }]);
    expect(result.current.siteLanguageOptions).toEqual(expect.arrayContaining([{ value: 'en', label: 'English' }]));
  });

  it('fetches the profile data manager for the authenticated user and their roles', async () => {
    const { result } = renderData();

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(getAccount).toHaveBeenCalledWith('edx');
    expect(getPreferences).toHaveBeenCalledWith('edx');
    expect(getProfileDataManager).toHaveBeenCalledWith('edx', user.roles);
  });

  it('fetches the time zones of the committed country', async () => {
    const { result } = renderData();

    await waitFor(() => expect(result.current.countryTimeZoneOptions).toHaveLength(1));
    expect(getTimeZones).toHaveBeenCalledWith();
    expect(getTimeZones).toHaveBeenCalledWith('US');
  });

  it('does not ask for country time zones without a country', async () => {
    getAccount.mockResolvedValue({ username: 'edx', name: 'Ed X', country: '' });
    const { result } = renderData();

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(getTimeZones).toHaveBeenCalledTimes(1);
    expect(getTimeZones).toHaveBeenCalledWith();
    expect(result.current.countryTimeZoneOptions).toEqual([]);
  });

  it('reports an error when a required request fails, without retrying a client error', async () => {
    getAccount.mockRejectedValue(Object.assign(new Error('Missing required request headers'), { response: { status: 403 } }));
    const { result } = renderData();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getAccount).toHaveBeenCalledTimes(1);
  });
});

describe('useThirdPartyAuthError', () => {
  it('fetches the message once per visit and drops it once nothing shows it', async () => {
    getThirdPartyAuthError.mockResolvedValue('Already linked.');
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper({ queryClient });

    const first = renderHook(() => useThirdPartyAuthError(), { wrapper });
    await waitFor(() => expect(first.result.current.data).toBe('Already linked.'));

    // Another reader during the same visit shares the answer rather than asking the LMS again.
    const second = renderHook(() => useThirdPartyAuthError(), { wrapper });
    expect(second.result.current.data).toBe('Already linked.');
    await waitFor(() => expect(second.result.current.isFetching).toBe(false));
    expect(getThirdPartyAuthError).toHaveBeenCalledTimes(1);

    // Leaving the page forgets the message, so the next visit asks afresh.
    first.unmount();
    second.unmount();
    await waitFor(() => expect(queryClient.getQueryData(accountSettingsKeys.thirdPartyAuthError)).toBeUndefined());
    getThirdPartyAuthError.mockResolvedValue(null);

    const third = renderHook(() => useThirdPartyAuthError(), { wrapper });
    await waitFor(() => expect(third.result.current.isFetching).toBe(false));
    expect(getThirdPartyAuthError).toHaveBeenCalledTimes(2);
    expect(third.result.current.data).toBeNull();
  });
});
