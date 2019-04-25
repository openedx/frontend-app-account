import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_ACCOUNT = new AsyncActionType('ACCOUNT_SETTINGS', 'FETCH_ACCOUNT');
export const SAVE_ACCOUNT = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_ACCOUNT');
export const RESET_PASSWORD = new AsyncActionType('ACCOUNT_SETTINGS', 'RESET_PASSWORD');
export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';

// FETCH EXAMPLE ACTIONS

export const fetchAccount = () => ({
  type: FETCH_ACCOUNT.BASE,
});

export const fetchAccountBegin = () => ({
  type: FETCH_ACCOUNT.BEGIN,
});

export const fetchAccountSuccess = values => ({
  type: FETCH_ACCOUNT.SUCCESS,
  payload: { values },
});

export const fetchAccountFailure = error => ({
  type: FETCH_ACCOUNT.FAILURE,
  payload: { error },
});

export const fetchAccountReset = () => ({
  type: FETCH_ACCOUNT.RESET,
});

export const openForm = formId => ({
  type: OPEN_FORM,
  payload: { formId },
});

export const closeForm = formId => ({
  type: CLOSE_FORM,
  payload: { formId },
});


// FORM STATE ACTIONS

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

// SAVE PROFILE ACTIONS

export const saveAccount = (formId, commitValues) => ({
  type: SAVE_ACCOUNT.BASE,
  payload: { formId, commitValues },
});

export const saveAccountBegin = () => ({
  type: SAVE_ACCOUNT.BEGIN,
});

export const saveAccountSuccess = (values, confirmationValues) => ({
  type: SAVE_ACCOUNT.SUCCESS,
  payload: { values, confirmationValues },
});

export const saveAccountReset = () => ({
  type: SAVE_ACCOUNT.RESET,
});

export const saveAccountFailure = ({ fieldErrors, message }) => ({
  type: SAVE_ACCOUNT.FAILURE,
  payload: { errors: fieldErrors, message },
});


// SAVE PROFILE ACTIONS

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

