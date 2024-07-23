import { camelCaseObject } from '@edx/frontend-platform';
import EMAIL_CADENCE from './constants';
import {
  fetchCourseListSuccess,
  fetchCourseListFetching,
  fetchCourseListFailed,
  fetchNotificationPreferenceFailed,
  fetchNotificationPreferenceFetching,
  fetchNotificationPreferenceSuccess,
  updatePreferenceValue,
  updateSelectedCourse,
} from './actions';
import {
  getCourseList,
  getCourseNotificationPreferences,
  patchPreferenceToggle,
} from './service';

const normalizeCourses = (responseData) => {
  const courseList = responseData.results?.map((enrollment) => ({
    id: enrollment.course.id,
    name: enrollment.course.displayName,
  })) || [];

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

const normalizePreferences = (responseData) => {
  const preferences = responseData.notificationPreferenceConfig;

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
        emailCadence: preferences[appId].notificationTypes[preferenceId].emailCadence || EMAIL_CADENCE.DAILY,
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

export const fetchCourseList = (page, pageSize) => (
  async (dispatch) => {
    try {
      dispatch(fetchCourseListFetching());
      const data = await getCourseList(page, pageSize);
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
        !value,
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
