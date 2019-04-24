import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_ACCOUNT = new AsyncActionType('EXAMPLE', 'FETCH_ACCOUNT');
export const SAVE_ACCOUNT = new AsyncActionType('ACCOUNT_SETTINGS', 'SAVE_ACCOUNT');
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

export const saveAccountSuccess = values => ({
  type: SAVE_ACCOUNT.SUCCESS,
  payload: { values },
});

export const saveAccountReset = () => ({
  type: SAVE_ACCOUNT.RESET,
});

export const saveAccountFailure = ({ fieldErrors, message }) => ({
  type: SAVE_ACCOUNT.FAILURE,
  payload: { errors: fieldErrors, message },
});

