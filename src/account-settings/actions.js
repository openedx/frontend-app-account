import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_SETTINGS');
export const SAVE_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_SETTINGS');
export const FETCH_TIME_ZONES = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_TIME_ZONES');
export const RESET_PASSWORD = new AsyncActionType('ACCOUNT_SETTINGS', 'RESET_PASSWORD');
export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';
export const DISCONNECT_AUTH = new AsyncActionType('ACCOUNT_SETTINGS', 'DISCONNECT_AUTH');


// FETCH SETTINGS ACTIONS

export const fetchSettings = () => ({
  type: FETCH_SETTINGS.BASE,
});

export const fetchSettingsBegin = () => ({
  type: FETCH_SETTINGS.BEGIN,
});

export const fetchSettingsSuccess = ({
  values,
  thirdPartyAuthProviders,
  profileDataManager,
  timeZones,
}) => ({
  type: FETCH_SETTINGS.SUCCESS,
  payload: {
    values,
    thirdPartyAuthProviders,
    profileDataManager,
    timeZones,
  },
});

export const fetchSettingsFailure = error => ({
  type: FETCH_SETTINGS.FAILURE,
  payload: { error },
});

export const fetchSettingsReset = () => ({
  type: FETCH_SETTINGS.RESET,
});


// FORM STATE ACTIONS

export const openForm = formId => ({
  type: OPEN_FORM,
  payload: { formId },
});

export const closeForm = formId => ({
  type: CLOSE_FORM,
  payload: { formId },
});

export const updateDraft = (name, value) => ({
  type: UPDATE_DRAFT,
  payload: {
    name,
    value,
  },
});

export const resetDrafts = () => ({
  type: RESET_DRAFTS,
});


// SAVE SETTINGS ACTIONS

export const saveSettings = (formId, commitValues) => ({
  type: SAVE_SETTINGS.BASE,
  payload: { formId, commitValues },
});

export const saveSettingsBegin = () => ({
  type: SAVE_SETTINGS.BEGIN,
});

export const saveSettingsSuccess = (values, confirmationValues) => ({
  type: SAVE_SETTINGS.SUCCESS,
  payload: { values, confirmationValues },
});

export const saveSettingsReset = () => ({
  type: SAVE_SETTINGS.RESET,
});

export const saveSettingsFailure = ({ fieldErrors, message }) => ({
  type: SAVE_SETTINGS.FAILURE,
  payload: { errors: fieldErrors, message },
});


// RESET PASSWORD ACTIONS

export const resetPassword = email => ({
  type: RESET_PASSWORD.BASE,
  payload: { email },
});

export const resetPasswordBegin = () => ({
  type: RESET_PASSWORD.BEGIN,
});

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD.SUCCESS,
});

export const resetPasswordReset = () => ({
  type: RESET_PASSWORD.RESET,
});


// FETCH TIME_ZONE ACTIONS

export const fetchTimeZones = country => ({
  type: FETCH_TIME_ZONES.BASE,
  payload: { country },
});

export const fetchTimeZonesSuccess = timeZones => ({
  type: FETCH_TIME_ZONES.SUCCESS,
  payload: { timeZones },
});


// DISCONNECT AUTH ACTIONS

export const disconnectAuth = (url, providerId) => ({
  type: DISCONNECT_AUTH.BASE, payload: { url, providerId },
});
export const disconnectAuthBegin = () => ({
  type: DISCONNECT_AUTH.BEGIN,
});
export const disconnectAuthSuccess = () => ({
  type: DISCONNECT_AUTH.SUCCESS,
});
export const disconnectAuthFailure = providerId => ({
  type: DISCONNECT_AUTH.FAILURE, payload: { providerId },
});
export const disconnectAuthReset = () => ({
  type: DISCONNECT_AUTH.RESET,
});
