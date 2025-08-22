import { camelCaseObject } from '@openedx/frontend-base';
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
import { normalizeCourses, normalizePreferences } from './utils';

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

export const fetchCourseList = (page, pageSize) =>
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
;

export const fetchCourseNotificationPreferences = (courseId) =>
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
;

export const setSelectedCourse = courseId =>
  async (dispatch) => {
    dispatch(updateSelectedCourse(courseId));
  }
;

export const updatePreferenceToggle = (
  courseId,
  notificationApp,
  notificationType,
  notificationChannel,
  value,
  emailCadence,
) =>
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
;
