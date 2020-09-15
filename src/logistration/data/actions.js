import { AsyncActionType } from './utils';

export const REGISTER_NEW_USER = new AsyncActionType('REGISTRATION', 'REGISTER_NEW_USER');
export const LOGIN_REQUEST = new AsyncActionType('LOGIN', 'REQUEST');

// Register

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

// Login
export const loginRequest = creds => ({
  type: LOGIN_REQUEST.BASE,
  payload: { creds },
});

export const loginRequestBegin = () => ({
  type: LOGIN_REQUEST.BEGIN,
});

export const loginRequestSuccess = (redirectUrl, success) => ({
  type: LOGIN_REQUEST.SUCCESS,
  payload: { redirectUrl, success },
});

export const loginRequestFailure = () => ({
  type: LOGIN_REQUEST.FAILURE,
});
