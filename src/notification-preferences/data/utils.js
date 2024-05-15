import { getConfig } from '@edx/frontend-platform';

export const notificationChannels = () => ({ WEB: 'web', ...(getConfig().SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences.filter(pref => pref.appId === appId);

  return appPreferences.length === 1 && appPreferences[0].id === 'core' && !appPreferences[0].coreNotificationTypes.length;
};
