import { AsyncActionType } from './utils';

export const REGISTER_NEW_USER = new AsyncActionType('REGISTRATION', 'REGISTER_NEW_USER');

// SAVE SETTINGS ACTIONS

export const registerNewUser = registrationInfo => ({
  type: REGISTER_NEW_USER.BASE,
  payload: { registrationInfo },
});

export const registerNewUserBegin = () => ({
  type: REGISTER_NEW_USER.BEGIN,
});

export const registerNewUserSuccess = () => ({
  type: REGISTER_NEW_USER.SUCCESS,
});

export const registerNewUserFailure = () => ({
  type: REGISTER_NEW_USER.FAILURE,
});
