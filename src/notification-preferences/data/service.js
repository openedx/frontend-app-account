import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import snakeCase from 'lodash.snakecase';

export const getNotificationPreferences = async () => {
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/v2/configurations/`;
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
    notificationApp,
    notificationType: snakeCase(notificationType),
    notificationChannel,
    value,
    emailCadence,
  });
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/v2/configurations/`;
  const { data } = await getAuthenticatedHttpClient().put(url, patchData);
  return data;
};
