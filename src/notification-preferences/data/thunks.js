import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchCourseListSuccess,
  fetchCourseListFetching,
  fetchCourseListFailed,
  fetchNotificationPreferenceFailed,
  fetchNotificationPreferenceFetching,
  fetchNotificationPreferenceSuccess,
  updateAppToggle,
  updatePreferenceValue,
  updateSelectedCourse,
} from './actions';
import {
  getCourseList,
  getCourseNotificationPreferences,
  patchAppPreferenceToggle,
  patchPreferenceToggle,
} from './service';

const normalizeCourses = (responseData) => (
  responseData.map((enrollment) => ({
    id: enrollment.course.id,
    name: enrollment.course.displayName,
  }))
);

const normalizePreferences = (responseData) => {
  const preferences = responseData.notificationPreferenceConfig;

  const appKeys = Object.keys(preferences);
  const apps = appKeys.map((appId) => ({
    id: appId,
    enabled: preferences[appId].enabled,
  }));

  const notEditable = {};
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
      }
    ));

    notEditable[appId] = preferences[appId].notEditable;

    return flatPreferences;
  }).flat();

  const normalizedPreferences = {
    apps,
    preferences: preferenceList,
    notEditable,
  };
  return normalizedPreferences;
};

export const fetchCourseList = () => (
  async (dispatch) => {
    try {
      dispatch(fetchCourseListFetching());
      const data = await getCourseList();
      const normalizedData = normalizeCourses(camelCaseObject(data));
      dispatch(fetchCourseListSuccess(normalizedData));
    } catch (errors) {
      dispatch(fetchCourseListFailed());
    }
  }
);

export const fetchCourseNotificationPreferences = (courseId) => (
  async (dispatch) => {
    try {
      dispatch(updateSelectedCourse(courseId));
      dispatch(fetchNotificationPreferenceFetching());
      const data = await getCourseNotificationPreferences(courseId);
      const normalizedData = normalizePreferences(camelCaseObject(data));
      dispatch(fetchNotificationPreferenceSuccess(courseId, normalizedData));
    } catch (errors) {
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);

export const updateAppPreferenceToggle = (courseId, appId, value) => (
  async (dispatch) => {
    try {
      dispatch(updateAppToggle(courseId, appId, value));
      const data = await patchAppPreferenceToggle(courseId, appId, value);
      const normalizedData = normalizePreferences(camelCaseObject(data));
      dispatch(fetchNotificationPreferenceSuccess(courseId, normalizedData));
    } catch (errors) {
      dispatch(updateAppToggle(courseId, appId, !value));
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);

export const updatePreferenceToggle = (
  courseId,
  notificationApp,
  notificationType,
  notificationChannel,
  value,
) => (
  async (dispatch) => {
    try {
      dispatch(updatePreferenceValue(
        notificationApp,
        notificationType,
        notificationChannel,
        value,
      ));
      const data = await patchPreferenceToggle(
        courseId,
        notificationApp,
        notificationType,
        notificationChannel,
        value,
      );
      const normalizedData = normalizePreferences(camelCaseObject(data));
      dispatch(fetchNotificationPreferenceSuccess(courseId, normalizedData));
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
