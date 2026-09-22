import { getAppConfig } from '@openedx/frontend-base';
import camelCase from 'lodash.camelcase';

import { parseEnvBoolean } from '../../utils';
import { EMAIL_CADENCE_PREFERENCES } from './constants';
import { appId } from '../../constants';

export const notificationChannels = (showEmailPreferences = true) => ({
  WEB: 'web',
  ...(parseEnvBoolean(getAppConfig(appId).SHOW_PUSH_CHANNEL) && { PUSH: 'push' }),
  ...(showEmailPreferences && { EMAIL: 'email' }),
});

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences.filter(pref => pref.appId === appId);
  return appPreferences.length === 0;
};

/**
 * Turns the camel-cased configurations response into the shape the components consume: a sorted
 * list of apps, a flat list of preferences, the per-app non-editable channels and the site-level
 * visibility flags.
 */
export const normalizePreferences = (response) => {
  const {
    data: preferences = {},
    showPreferences = false,
    showEmailPreferences = true,
  } = response;

  const appKeys = Object.keys(preferences);
  const apps = appKeys.map((appId) => ({
    id: appId,
    enabled: preferences[appId].enabled,
  })).sort((a, b) => a.id.localeCompare(b.id));

  const nonEditable = {};
  const preferenceList = appKeys.flatMap((appId) => {
    const notificationTypes = preferences[appId].notificationTypes || {};
    nonEditable[appId] = preferences[appId].nonEditable;

    return Object.keys(notificationTypes).map(preferenceId => ({
      id: preferenceId,
      appId,
      web: notificationTypes[preferenceId].web,
      push: notificationTypes[preferenceId].push,
      email: notificationTypes[preferenceId].email,
      info: notificationTypes[preferenceId].info || '',
      emailCadence: notificationTypes[preferenceId].emailCadence || EMAIL_CADENCE_PREFERENCES.DAILY,
    }));
  });

  return {
    apps,
    preferences: preferenceList,
    nonEditable,
    showPreferences,
    showEmailPreferences,
  };
};

/**
 * Applies the `updated_value` reported by a configurations PUT to the normalized preferences,
 * returning a new object. The response names the type and channel in snake case.
 */
export const applyPreferenceUpdate = (normalized, response) => {
  const update = response?.data;
  if (!normalized || !update) {
    return normalized;
  }

  const {
    app, notificationType, channel, updatedValue,
  } = update;
  const preferenceId = camelCase(notificationType);
  const channelKey = camelCase(channel);

  return {
    ...normalized,
    preferences: normalized.preferences.map((preference) => (
      preference.appId === app && preference.id === preferenceId
        ? { ...preference, [channelKey]: updatedValue }
        : preference
    )),
  };
};
