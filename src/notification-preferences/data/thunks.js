import { camelCaseObject } from '@edx/frontend-platform';
import camelCase from 'lodash.camelcase';
import { EMAIL, EMAIL_CADENCE, EMAIL_CADENCE_PREFERENCES } from './constants';
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
  postPreferenceToggle,
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

export const normalizeAccountPreferences = (originalData, updateInfo) => {
  const {
    app, notificationType, channel, updatedValue,
  } = updateInfo.data;

  const preferenceToUpdate = originalData.preferences.find(
    (preference) => preference.appId === app && preference.id === camelCase(notificationType),
  );

  if (preferenceToUpdate) {
    preferenceToUpdate[camelCase(channel)] = updatedValue;
  }

  return originalData;
};

const normalizePreferences = (responseData, courseId) => {
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
        info: preferences[appId].notificationTypes[preferenceId].info || '',
        emailCadence: preferences[appId].notificationTypes[preferenceId].emailCadence
        || EMAIL_CADENCE_PREFERENCES.DAILY,
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
      const normalizedData = normalizePreferences(camelCaseObject(data), courseId);
      dispatch(fetchNotificationPreferenceSuccess(courseId, normalizedData));
    } catch (errors) {
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);

export const setSelectedCourse = courseId => (
  async (dispatch) => {
    dispatch(updateSelectedCourse(courseId));
  }
);

export const updatePreferenceToggle = (
  courseId,
  notificationApp,
  notificationType,
  notificationChannel,
  value,
  emailCadence,
) => (
  async (dispatch) => {
    try {
      // Initially update the UI to give immediate feedback
      dispatch(updatePreferenceValue(
        notificationApp,
        notificationType,
        notificationChannel,
        !value,
      ));

      // Function to handle data normalization and dispatching success
      const handleSuccessResponse = (data, isGlobal = false) => {
        const processedData = courseId
          ? normalizePreferences(camelCaseObject(data), courseId)
          : camelCaseObject(data);

        dispatch(fetchNotificationPreferenceSuccess(courseId, processedData, isGlobal));
        return processedData;
      };

      // Function to toggle preference based on context (course-specific or global)
      const togglePreference = async (channel, toggleValue, cadence) => {
        if (courseId) {
          return patchPreferenceToggle(
            courseId,
            notificationApp,
            notificationType,
            channel,
            channel === EMAIL_CADENCE ? cadence : toggleValue,
          );
        }

        return postPreferenceToggle(
          notificationApp,
          notificationType,
          channel,
          channel === EMAIL_CADENCE ? undefined : toggleValue,
          cadence,
        );
      };

      // Execute the main preference toggle
      const data = await togglePreference(notificationChannel, value, emailCadence);
      handleSuccessResponse(data, !courseId);

      // Handle special case for email notifications
      if (notificationChannel === EMAIL && value) {
        const emailCadenceData = await togglePreference(
          EMAIL_CADENCE,
          courseId ? undefined : value,
          EMAIL_CADENCE_PREFERENCES.DAILY,
        );

        handleSuccessResponse(emailCadenceData, !courseId);
      }
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
