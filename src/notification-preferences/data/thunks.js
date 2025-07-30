import { camelCaseObject } from '@edx/frontend-platform';
import camelCase from 'lodash.camelcase';
import { EMAIL, EMAIL_CADENCE, EMAIL_CADENCE_PREFERENCES } from './constants';
import {
  fetchNotificationPreferenceFailed,
  fetchNotificationPreferenceFetching,
  fetchNotificationPreferenceSuccess,
  updatePreferenceValue,
} from './actions';
import {
  getNotificationPreferences,
  postPreferenceToggle,
} from './service';

export const normalizeAccountPreferences = (originalData, updateInfo) => {
  const {
    app, notificationType, channel, updatedValue,
  } = updateInfo.data;

  const preferenceToUpdate = originalData.preferences.find(
    (preference) => preference.appId === app && preference.id === camelCase(notificationType),
  );

  if (preferenceToUpdate) {
    preferenceToUpdate[camelCase(channel)] = updatedValue;
  }

  return originalData;
};

const normalizePreferences = (responseData) => {
  const preferences = responseData.data;

  const appKeys = Object.keys(preferences);
  const apps = appKeys.map((appId) => ({
    id: appId,
    enabled: preferences[appId].enabled,
  }));

  const nonEditable = {};
  const preferenceList = appKeys.map(appId => {
    const preferencesKeys = Object.keys(preferences[appId].notificationTypes);
    const flatPreferences = preferencesKeys.map(preferenceId => (
      {
        id: preferenceId,
        appId,
        web: preferences[appId].notificationTypes[preferenceId].web,
        push: preferences[appId].notificationTypes[preferenceId].push,
        email: preferences[appId].notificationTypes[preferenceId].email,
        info: preferences[appId].notificationTypes[preferenceId].info || '',
        emailCadence: preferences[appId].notificationTypes[preferenceId].emailCadence
        || EMAIL_CADENCE_PREFERENCES.DAILY,
        coreNotificationTypes: preferences[appId].coreNotificationTypes || [],
      }
    ));
    nonEditable[appId] = preferences[appId].nonEditable;

    return flatPreferences;
  }).flat();

  const normalizedPreferences = {
    apps,
    preferences: preferenceList,
    nonEditable,
  };
  return normalizedPreferences;
};

export const fetchNotificationPreferences = () => (
  async (dispatch) => {
    try {
      dispatch(fetchNotificationPreferenceFetching());
      const data = camelCaseObject(await getNotificationPreferences());
      const normalizedData = normalizePreferences(data);
      dispatch(fetchNotificationPreferenceSuccess(normalizedData, data.showPreferences));
    } catch (errors) {
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);

export const updatePreferenceToggle = (
  notificationApp,
  notificationType,
  notificationChannel,
  value,
  emailCadence,
) => (
  async (dispatch) => {
    try {
      // Initially update the UI to give immediate feedback
      dispatch(updatePreferenceValue(
        notificationApp,
        notificationType,
        notificationChannel,
        !value,
      ));

      // Function to handle data normalization and dispatching success
      const handleSuccessResponse = (data) => {
        const processedData = camelCaseObject(data);

        dispatch(fetchNotificationPreferenceSuccess(processedData, processedData.showPreferences, true));
        return processedData;
      };

      // Function to toggle preference based on context
      const togglePreference = async (channel, toggleValue, cadence) => postPreferenceToggle(
        notificationApp,
        notificationType,
        channel,
        channel === EMAIL_CADENCE ? undefined : toggleValue,
        cadence,
      );

      // Execute the main preference toggle
      const data = await togglePreference(notificationChannel, value, emailCadence);
      handleSuccessResponse(data);

      // Handle special case for email notifications
      if (notificationChannel === EMAIL && value) {
        const emailCadenceData = await togglePreference(
          EMAIL_CADENCE,
          value,
          EMAIL_CADENCE_PREFERENCES.DAILY,
        );

        handleSuccessResponse(emailCadenceData);
      }
    } catch (errors) {
      dispatch(updatePreferenceValue(
        notificationApp,
        notificationType,
        notificationChannel,
        !value,
      ));
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);
