import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchCourseListSuccess,
  fetchCourseListFetching,
  fetchCourseListFailed,
  fetchNotificationPreferenceFailed,
  fetchNotificationPreferenceFetching,
  fetchNotificationPreferenceSuccess,
} from './actions';
import {
  getCourseList,
  getCourseNotificationPreferences,
} from './service';

const normalizePreferences = (preferences) => {
  const groups = Object.keys(preferences);
  const preferenceList = groups.map(groupId => {
    const preferencesKeys = Object.keys(preferences[groupId]);
    const flatPreferences = preferencesKeys.map(preferenceId => (
      {
        id: preferenceId,
        groupId,
        web: preferences?.[groupId]?.[preferenceId].web,
        push: preferences?.[groupId]?.[preferenceId].push,
        mobile: preferences?.[groupId]?.[preferenceId].mobile,
      }
    ));
    return flatPreferences;
  }).flat();
  const normalizedPreferences = {
    groups,
    preferences: preferenceList,
  };
  return normalizedPreferences;
};

export const fetchCourseList = () => (
  async (dispatch) => {
    try {
      dispatch(fetchCourseListFetching());
      const data = await getCourseList();
      dispatch(fetchCourseListSuccess(data));
    } catch (errors) {
      dispatch(fetchCourseListFailed());
    }
  }
);

export const fetchCourseNotificationPreferences = (courseId) => (
  async (dispatch) => {
    try {
      dispatch(fetchNotificationPreferenceFetching());
      const data = await getCourseNotificationPreferences(courseId);
      const normalizedData = normalizePreferences(camelCaseObject(data));
      dispatch(fetchNotificationPreferenceSuccess(courseId, normalizedData));
    } catch (errors) {
      dispatch(fetchNotificationPreferenceFailed());
    }
  }
);
