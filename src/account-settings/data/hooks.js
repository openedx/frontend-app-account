import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAuthenticatedUser, getSupportedLanguageList } from '@openedx/frontend-base';

import {
  getAccount,
  getCountryList,
  getPreferences,
  getProfileDataManager,
  getTimeZones,
  getVerifiedNameHistory,
} from './api';
import { getThirdPartyAuthError, getThirdPartyAuthProviders } from '../third-party-auth/data/api';
import { retryUnlessClientError } from '../../data/queryOptions';
import { accountSettingsKeys } from './queryKeys';
import { useAccountSettingsForm } from './FormContext';
import {
  getCommittedValues,
  getFormValues,
  getMostRecentApprovedVerifiedName,
  getMostRecentVerifiedName,
  getSiteLanguageOptions,
  getStaticFields,
  sortVerifiedNameHistory,
  transformTimeZonesToOptions,
} from './derive';

const EMPTY_LIST = [];

/**
 * The account and the preferences are two endpoints for one form, so they are fetched together
 * and merged flat, exactly as the components have always consumed them.
 */
export const useSettingsValues = () => {
  const { username } = getAuthenticatedUser();

  return useQuery({
    queryKey: accountSettingsKeys.values(username),
    queryFn: async () => {
      const [account, preferences] = await Promise.all([
        getAccount(username),
        getPreferences(username),
      ]);
      return { ...account, ...preferences };
    },
    retry: retryUnlessClientError,
  });
};

export const useVerifiedNameHistory = () => useQuery({
  queryKey: accountSettingsKeys.verifiedNameHistory,
  queryFn: getVerifiedNameHistory,
  retry: retryUnlessClientError,
});

export const useThirdPartyAuthProviders = () => useQuery({
  queryKey: accountSettingsKeys.thirdPartyAuthProviders,
  queryFn: getThirdPartyAuthProviders,
  retry: retryUnlessClientError,
});

/**
 * The LMS consumes the third-party auth error message on read, so it can only ever be fetched
 * once per visit to the page. This query never goes stale, so nothing refetches it while the
 * page shows it, and it is dropped as soon as the page stops observing it, so the next visit
 * (the app stays loaded across the shell's soft navigations) asks the LMS afresh.
 */
export const useThirdPartyAuthError = () => useQuery({
  queryKey: accountSettingsKeys.thirdPartyAuthError,
  queryFn: getThirdPartyAuthError,
  retry: retryUnlessClientError,
  staleTime: Infinity,
  gcTime: 0,
});

export const useProfileDataManager = () => {
  const { username, roles } = getAuthenticatedUser();

  return useQuery({
    queryKey: accountSettingsKeys.profileDataManager(username),
    queryFn: () => getProfileDataManager(username, roles),
    retry: retryUnlessClientError,
    staleTime: Infinity,
  });
};

export const useTimeZones = () => useQuery({
  queryKey: accountSettingsKeys.timeZones,
  queryFn: () => getTimeZones(),
  retry: retryUnlessClientError,
  staleTime: Infinity,
});

/**
 * Time zones for the committed country. Re-keys when the country changes and keeps the previous
 * list on screen until the new one arrives.
 */
export const useCountryTimeZones = (country) => useQuery({
  queryKey: accountSettingsKeys.countryTimeZones(country),
  queryFn: () => getTimeZones(country),
  enabled: Boolean(country),
  retry: retryUnlessClientError,
  staleTime: Infinity,
  placeholderData: keepPreviousData,
});

export const useCountries = () => useQuery({
  queryKey: accountSettingsKeys.countries,
  queryFn: getCountryList,
  retry: retryUnlessClientError,
  staleTime: Infinity,
});

/**
 * Everything the settings page renders from, combining the queries above with the form state.
 * `isPending` and `isError` gate the whole page, as the single fetch used to.
 */
export const useAccountSettingsData = () => {
  const values = useSettingsValues();
  const verifiedNameHistory = useVerifiedNameHistory();
  const providers = useThirdPartyAuthProviders();
  const thirdPartyAuthError = useThirdPartyAuthError();
  const profileDataManager = useProfileDataManager();
  const timeZones = useTimeZones();
  const countries = useCountries();
  const countryTimeZones = useCountryTimeZones(values.data?.country);
  const { drafts, confirmationValues } = useAccountSettingsForm();

  const queries = [
    values, verifiedNameHistory, providers, thirdPartyAuthError, profileDataManager, timeZones, countries,
  ];
  const isPending = queries.some(query => query.isPending);
  const isError = queries.some(query => query.isError);

  const sortedVerifiedNameHistory = useMemo(
    () => sortVerifiedNameHistory(verifiedNameHistory.data),
    [verifiedNameHistory.data],
  );
  const mostRecentVerifiedName = getMostRecentVerifiedName(sortedVerifiedNameHistory);
  const verifiedName = getMostRecentApprovedVerifiedName(sortedVerifiedNameHistory);

  const committedValues = useMemo(() => getCommittedValues({
    values: values.data ?? {},
    verifiedNameHistory: verifiedNameHistory.data,
    confirmationValues,
    approvedVerifiedName: verifiedName,
  }), [values.data, verifiedNameHistory.data, confirmationValues, verifiedName]);

  const formValues = useMemo(() => getFormValues(committedValues, drafts), [committedValues, drafts]);

  const timeZoneOptions = useMemo(
    () => transformTimeZonesToOptions(timeZones.data ?? EMPTY_LIST),
    [timeZones.data],
  );
  const countryTimeZoneOptions = useMemo(
    () => transformTimeZonesToOptions(countryTimeZones.data ?? EMPTY_LIST),
    [countryTimeZones.data],
  );
  // The languages with bundled translations, the same list the shell's language menu offers.
  const siteLanguageOptions = useMemo(() => getSiteLanguageOptions(getSupportedLanguageList()), []);

  return {
    isPending,
    isError,
    committedValues,
    formValues,
    verifiedName,
    mostRecentVerifiedName,
    verifiedNameHistory: sortedVerifiedNameHistory,
    staticFields: getStaticFields(profileDataManager.data, mostRecentVerifiedName),
    profileDataManager: profileDataManager.data ?? null,
    timeZoneOptions,
    countryTimeZoneOptions,
    tpaProviders: providers.data ?? EMPTY_LIST,
    thirdPartyAuthError: thirdPartyAuthError.data ?? null,
    countriesCodesList: countries.data ?? EMPTY_LIST,
    isActive: values.data?.is_active,
    siteLanguageOptions,
  };
};
