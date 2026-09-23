import { useMemo } from 'react';
import {
  useIsMutating, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';

import { camelCaseObject, logError } from '@openedx/frontend-base';

import { getNotificationPreferences, postPreferenceToggle } from '@src/notification-preferences/data/api';
import { EMAIL, EMAIL_CADENCE } from '@src/notification-preferences/data/constants';
import { retryUnlessClientError } from '@src/data/queryOptions';
import { notificationPreferencesKeys } from '@src/notification-preferences/data/queryKeys';
import { applyPreferenceUpdate, normalizePreferences } from '@src/notification-preferences/data/utils';

const EMPTY_PREFERENCES = [];
const EMPTY_CHANNELS = {};

export const useNotificationPreferences = () => useQuery({
  queryKey: notificationPreferencesKeys.all,
  queryFn: async () => normalizePreferences(camelCaseObject(await getNotificationPreferences())),
  retry: retryUnlessClientError,
});

export const useShowPreferences = () => {
  const { data } = useNotificationPreferences();
  return data?.showPreferences ?? false;
};

export const useShowEmailPreferences = () => {
  const { data } = useNotificationPreferences();
  return data?.showEmailPreferences ?? true;
};

export const usePreferenceAppIds = () => {
  const { data } = useNotificationPreferences();
  return useMemo(() => (data?.apps ?? []).map(app => app.id), [data]);
};

export const usePreferenceApp = (appId) => {
  const { data } = useNotificationPreferences();
  return data?.apps.find(app => app.id === appId);
};

export const useAppPreferences = (appId) => {
  const { data } = useNotificationPreferences();
  return useMemo(
    () => (data ? data.preferences.filter(preference => preference.appId === appId) : EMPTY_PREFERENCES),
    [data, appId],
  );
};

export const useAppNonEditableChannels = (appId) => {
  const { data } = useNotificationPreferences();
  return data?.nonEditable[appId] || EMPTY_CHANNELS;
};

/**
 * True while any preference toggle is being saved. Every toggle on the page is disabled for the
 * duration, so a learner cannot queue up conflicting changes.
 */
export const useIsUpdatingPreferences = () => (
  useIsMutating({ mutationKey: notificationPreferencesKeys.toggle }) > 0
);

export const useUpdatePreferenceToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: notificationPreferencesKeys.toggle,
    mutationFn: async ({
      notificationApp,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    }) => {
      const toggle = (channel, toggleValue, cadence) => postPreferenceToggle(
        notificationApp,
        notificationType,
        channel,
        channel === EMAIL_CADENCE ? undefined : toggleValue,
        cadence,
      );

      const responses = [await toggle(notificationChannel, value, emailCadence)];

      // Turning email on also (re)asserts the cadence, which the API stores as its own channel.
      if (notificationChannel === EMAIL && value) {
        responses.push(await toggle(EMAIL_CADENCE, value, emailCadence));
      }

      return responses.map(camelCaseObject);
    },
    onSuccess: (responses) => {
      queryClient.setQueryData(
        notificationPreferencesKeys.all,
        (current) => responses.reduce(applyPreferenceUpdate, current),
      );
    },
    onError: (error) => {
      logError(error);
    },
  });
};
