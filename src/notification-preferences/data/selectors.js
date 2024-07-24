export const selectNotificationPreferencesStatus = () => state => (
  state.notificationPreferences.preferences.status
);

export const selectUpdatePreferencesStatus = () => state => (
  state.notificationPreferences.preferences.updatePreferenceStatus
);

export const selectPreferences = () => state => (
  state.notificationPreferences.preferences?.preferences
);

export const selectCourseListStatus = () => state => (
  state.notificationPreferences.courses.status
);

export const selectCourseList = () => state => (
  state.notificationPreferences.courses.courses
);

export const selectCourse = courseId => state => (
  selectCourseList()(state).find(
    course => course.id === courseId,
  )
);

export const selectPreferenceAppsId = () => state => (
  state.notificationPreferences.preferences.apps.map(app => app.id)
);

export const selectAppPreferences = appId => state => (
  selectPreferences()(state).filter(preference => (
    preference.appId === appId
  ))
);

export const selectPreferenceApp = appId => state => (
  state.notificationPreferences.preferences.apps.find(app => (
    app.id === appId
  ))
);

export const selectPreferenceAppToggleValue = appId => state => (
  selectPreferenceApp(appId)(state).enabled
);

export const selectPreference = (appId, name) => state => (
  selectPreferences()(state).find((preference) => (
    preference.id === name && preference.appId === appId
  ))
);

export const selectPreferenceNonEditableChannels = (appId, name) => state => (
  state?.notificationPreferences.preferences.nonEditable[appId]?.[name] || []
);

export const selectSelectedCourseId = () => state => (
  state.notificationPreferences.preferences.selectedCourse
);

export const selectPagination = () => state => (
  state.notificationPreferences.courses.pagination
);

export const selectShowPreferences = () => state => (
  state.notificationPreferences.showPreferences
);
