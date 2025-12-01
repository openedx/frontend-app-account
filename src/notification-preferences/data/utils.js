import { getConfig } from '@edx/frontend-platform';

import { parseEnvBoolean } from '../../utils';

export const notificationChannels = () => ({
  WEB: 'web',
  ...(parseEnvBoolean(getConfig().SHOW_PUSH_CHANNEL) && { PUSH: 'push' }),
  ...(parseEnvBoolean(getConfig().SHOW_EMAIL_CHANNEL) && { EMAIL: 'email' }),
});

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences.filter(pref => pref.appId === appId);

  if (appPreferences.length !== 1) {
    return false;
  }

  const firstPreference = appPreferences[0];

  return firstPreference?.id === 'core' && (!firstPreference.coreNotificationTypes?.length);
};
