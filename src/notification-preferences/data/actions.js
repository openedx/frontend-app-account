export const Actions = {
  FETCHED_PREFERENCES: 'fetchedPreferences',
  FETCHING_PREFERENCES: 'fetchingPreferences',
  FAILED_PREFERENCES: 'failedPreferences',
  FETCHING_COURSE_LIST: 'fetchingCourseList',
  FETCHED_COURSE_LIST: 'fetchedCourseList',
  FAILED_COURSE_LIST: 'failedCourseList',
  UPDATE_SELECTED_COURSE: 'updateSelectedCourse',
  UPDATE_PREFERENCE: 'updatePreference',
  UPDATE_GROUP_PREFERENCE: 'updateGroupValue',
};

export const fetchNotificationPreferenceSuccess = (courseId, payload) => dispatch => (
  dispatch({ type: Actions.FETCHED_PREFERENCES, courseId, payload })
);

export const fetchNotificationPreferenceFetching = () => dispatch => (
  dispatch({ type: Actions.FETCHING_PREFERENCES })
);

export const fetchNotificationPreferenceFailed = () => dispatch => (
  dispatch({ type: Actions.FAILED_PREFERENCES })
);

export const fetchCourseListSuccess = payload => dispatch => (
  dispatch({ type: Actions.FETCHED_COURSE_LIST, payload })
);

export const fetchCourseListFetching = () => dispatch => (
  dispatch({ type: Actions.FETCHING_COURSE_LIST })
);

export const fetchCourseListFailed = () => dispatch => (
  dispatch({ type: Actions.FAILED_COURSE_LIST })
);

export const updateSelectedCourse = courseId => dispatch => (
  dispatch({ type: Actions.UPDATE_SELECTED_COURSE, courseId })
);

export const updatePreferenceValue = (groupName, preferenceName, notificationChannel, value) => dispatch => (
  dispatch({
    type: Actions.UPDATE_PREFERENCE,
    groupName,
    preferenceName,
    notificationChannel,
    value,
  })
);

export const updateGroupValue = (courseId, groupName, value) => dispatch => (
  dispatch({
    type: Actions.UPDATE_GROUP_PREFERENCE,
    courseId,
    groupName,
    value,
  })
);
