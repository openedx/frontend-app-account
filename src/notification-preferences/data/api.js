import {
  snakeCaseObject,
  getAuthenticatedHttpClient,
  getSiteConfig,
} from '@openedx/frontend-base';
import snakeCase from 'lodash.snakecase';

export const getNotificationPreferences = async () => {
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/v3/configurations/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const postPreferenceToggle = async (
  notificationApp,
  notificationType,
  notificationChannel,
  value,
  emailCadence,
) => {
  const patchData = snakeCaseObject({
    notificationApp: snakeCase(notificationApp),
    notificationType: snakeCase(notificationType),
    notificationChannel,
    value,
    emailCadence,
  });
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/v3/configurations/`;
  const { data } = await getAuthenticatedHttpClient().put(url, patchData);
  return data;
};
