import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_SETTINGS');
export const SAVE_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_SETTINGS');
export const RESET_PASSWORD = new AsyncActionType('ACCOUNT_SETTINGS', 'RESET_PASSWORD');
export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';


// FETCH SETTINGS ACTIONS

export const fetchSettings = () => ({
  type: FETCH_SETTINGS.BASE,
});

export const fetchSettingsBegin = () => ({
  type: FETCH_SETTINGS.BEGIN,
});

export const fetchSettingsSuccess = ({ values, thirdPartyAuthProviders }) => ({
  type: FETCH_SETTINGS.SUCCESS,
  payload: { values, thirdPartyAuthProviders },
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

export const resetPassword = () => ({
  type: RESET_PASSWORD.BASE,
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
