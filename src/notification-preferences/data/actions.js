export const Actions = {
  FETCHED_PREFERENCES: 'fetchedPreferences',
  FETCHING_PREFERENCES: 'fetchingPreferences',
  FAILED_PREFERENCES: 'failedPreferences',
  UPDATE_PREFERENCE: 'updatePreference',
  UPDATE_APP_PREFERENCE: 'updateAppValue',
};

export const fetchNotificationPreferenceSuccess = (payload, showPreferences, isPreferenceUpdate) => dispatch => {
  dispatch({
    type: Actions.FETCHED_PREFERENCES, payload, showPreferences, isPreferenceUpdate,
  });
};

export const fetchNotificationPreferenceFetching = () => dispatch => (
  dispatch({ type: Actions.FETCHING_PREFERENCES })
);

export const fetchNotificationPreferenceFailed = () => dispatch => (
  dispatch({ type: Actions.FAILED_PREFERENCES })
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
