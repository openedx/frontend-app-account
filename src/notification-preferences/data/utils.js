import { getAppConfig } from '@openedx/frontend-base';
import { appId } from '../../constants';

export const notificationChannels = () => ({ WEB: 'web', ...(getAppConfig(appId).SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences.filter(pref => pref.appId === appId);

  if (appPreferences.length !== 1) {
    return false;
  }

  const firstPreference = appPreferences[0];

  return firstPreference?.id === 'core' && (!firstPreference.coreNotificationTypes?.length);
};
