import { getAppConfig } from '@openedx/frontend-base';
import { appId } from '../../constants';
import { EMAIL_CADENCE_PREFERENCES } from './constants';

export const notificationChannels = () => ({ WEB: 'web', ...(getAppConfig(appId).SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences?.filter(pref => pref.appId === appId);

  if (appPreferences?.length !== 1) {
    return false;
  }

  const firstPreference = appPreferences[0];

  return firstPreference?.id === 'core' && (!firstPreference.coreNotificationTypes?.length);
};

export const normalizeCourses = (responseData) => {
  const courseList = responseData.results?.map((enrollment) => ({
    id: enrollment.course.id,
    name: enrollment.course.displayName,
  })) ?? [];

  const pagination = {
    count: responseData.count,
    currentPage: responseData.currentPage,
    hasMore: Boolean(responseData.next),
    totalPages: responseData.numPages,
  };

  return {
    courseList,
    pagination,
    showPreferences: responseData.showPreferences,
  };
};

export const normalizePreferences = (responseData, courseId) => {
  let preferences;
  if (courseId) {
    preferences = responseData.notificationPreferenceConfig;
  } else {
    preferences = responseData.data;
  }

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
        info: preferences[appId].notificationTypes[preferenceId].info ?? '',
        emailCadence: preferences[appId].notificationTypes[preferenceId].emailCadence
          ?? EMAIL_CADENCE_PREFERENCES.DAILY,
        coreNotificationTypes: preferences[appId].coreNotificationTypes ?? [],
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
