import { AsyncActionType } from './utils';

export const FETCH_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_SETTINGS');
export const SAVE_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_SETTINGS');
export const SAVE_MULTIPLE_SETTINGS = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_MULTIPLE_SETTINGS');
export const FETCH_TIME_ZONES = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_TIME_ZONES');
export const SAVE_PREVIOUS_SITE_LANGUAGE = 'SAVE_PREVIOUS_SITE_LANGUAGE';
export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';
export const BEGIN_NAME_CHANGE = 'BEGIN_NAME_CHANGE';

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
  verifiedNameHistory,
}) => ({
  type: FETCH_SETTINGS.SUCCESS,
  payload: {
    values,
    thirdPartyAuthProviders,
    profileDataManager,
    timeZones,
    verifiedNameHistory,
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

export const beginNameChange = (formId) => ({
  type: BEGIN_NAME_CHANGE,
  payload: { formId },
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

export const savePreviousSiteLanguage = previousSiteLanguage => ({
  type: SAVE_PREVIOUS_SITE_LANGUAGE,
  payload: { previousSiteLanguage },
});

export const saveMultipleSettings = (settingsArray, form = null) => ({
  type: SAVE_MULTIPLE_SETTINGS.BASE,
  payload: { settingsArray, form },
});

export const saveMultipleSettingsBegin = () => ({
  type: SAVE_MULTIPLE_SETTINGS.BEGIN,
});

export const saveMultipleSettingsSuccess = settingsArray => ({
  type: SAVE_MULTIPLE_SETTINGS.SUCCESS,
  payload: { settingsArray },
});

export const saveMultipleSettingsFailure = ({ fieldErrors, message }) => ({
  type: SAVE_MULTIPLE_SETTINGS.FAILURE,
  payload: { errors: fieldErrors, message },
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
