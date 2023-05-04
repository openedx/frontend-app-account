export const notificationPreferencesStatus = () => state => (
  state.notificationPreferences.preferences.status
);

export const getPreferences = () => state => (
  state.notificationPreferences?.preferences?.preferences
);

export const courseListStatus = () => state => (
  state.notificationPreferences.courses.status
);

export const getCourseList = () => state => (
  state.notificationPreferences.courses.courses
);

export const getCourse = courseId => state => (
  getCourseList()(state).find(
    element => element.id === courseId,
  )
);

export const getPreferenceGroupIds = () => state => (
  state.notificationPreferences.preferences.groups
);

export const getPreferenceGroup = group => state => (
  getPreferences()(state).filter((preference) => (
    preference.groupId === group
  ))
);

export const getPreferenceAttribute = (group, name) => state => (
  getPreferenceGroup(group)(state).find((preference) => (
    preference.id === name
  ))
);

export const getSelectedCourse = () => state => (
  state.notificationPreferences.preferences.selectedCourse
);
