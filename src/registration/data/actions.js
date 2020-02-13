import { AsyncActionType } from './utils';

export const REGISTER_NEW_USER = new AsyncActionType('REGISTRATION', 'REGISTER_NEW_USER');

// SAVE SETTINGS ACTIONS

export const registerNewUser = (formId, commitValues) => ({
  type: REGISTER_NEW_USER.BASE,
  payload: { formId, commitValues },
});

export const registerNewUserBegin = () => ({
  type: REGISTER_NEW_USER.BEGIN,
});

export const registerNewUserSuccess = (values, confirmationValues) => ({
  type: REGISTER_NEW_USER.SUCCESS,
  payload: { values, confirmationValues },
});

export const registerNewUserFailure = ({ fieldErrors, message }) => ({
  type: REGISTER_NEW_USER.FAILURE,
  payload: { errors: fieldErrors, message },
});
