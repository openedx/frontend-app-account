export const Actions = {
  FETCHED_PREFERENCES: 'fetchedPreferences',
  FETCHING_PREFERENCES: 'fetchingPreferences',
  FAILED_PREFERENCES: 'failedPreferences',
  FETCHING_COURSE_LIST: 'fetchingCourseList',
  FETCHED_COURSE_LIST: 'fetchedCourseList',
  FAILED_COURSE_LIST: 'failedCourseList',
  UPDATE_SELECTED_COURSE: 'updateSelectedCourse',
  UPDATE_PREFERENCE: 'updatePreference',
  UPDATE_APP_PREFERENCE: 'updateAppValue',
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

export const updatePreferenceValue = (appId, preferenceName, notificationChannel, value) => dispatch => (
  dispatch({
    type: Actions.UPDATE_PREFERENCE,
    appId,
    preferenceName,
    notificationChannel,
    value,
  })
);

export const updateAppToggle = (courseId, appId, value) => dispatch => (
  dispatch({
    type: Actions.UPDATE_APP_PREFERENCE,
    courseId,
    appId,
    value,
  })
);
