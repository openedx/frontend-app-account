import { getSiteConfig, snakeCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import snakeCase from 'lodash.snakecase';

export const getCourseNotificationPreferences = async (courseId) => {
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/configurations/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const getCourseList = async (page, pageSize) => {
  const params = snakeCaseObject({ page, pageSize });
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/enrollments/`;
  const { data } = await getAuthenticatedHttpClient().get(url, { params });
  return data;
};

export const patchPreferenceToggle = async (
  courseId,
  notificationApp,
  notificationType,
  notificationChannel,
  value,
) => {
  const patchData = snakeCaseObject({
    notificationApp,
    notificationType: snakeCase(notificationType),
    notificationChannel,
    value,
  });
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/configurations/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().patch(url, patchData);
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
  const url = `${getSiteConfig().lmsBaseUrl}/api/notifications/preferences/update-all/`;
  const { data } = await getAuthenticatedHttpClient().post(url, patchData);
  return data;
};
