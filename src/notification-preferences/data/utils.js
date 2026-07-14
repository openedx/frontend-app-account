import { getConfig } from '@edx/frontend-platform';

import { parseEnvBoolean } from '../../utils';

export const notificationChannels = (showEmailPreferences = true) => ({
  WEB: 'web',
  ...(parseEnvBoolean(getConfig().SHOW_PUSH_CHANNEL) && { PUSH: 'push' }),
  ...(showEmailPreferences && { EMAIL: 'email' }),
});

export const shouldHideAppPreferences = (preferences, appId) => {
  const appPreferences = preferences.filter(pref => pref.appId === appId);
  return appPreferences.length === 0;
};
