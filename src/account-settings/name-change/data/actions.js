import { AsyncActionType } from '../../data/utils';

export const REQUEST_NAME_CHANGE = new AsyncActionType('ACCOUNT_SETTINGS', 'REQUEST_NAME_CHANGE');

export const requestNameChange = (username, profileName, verifiedName) => ({
  type: REQUEST_NAME_CHANGE.BASE,
  payload: { username, profileName, verifiedName },
});

export const requestNameChangeBegin = () => ({
  type: REQUEST_NAME_CHANGE.BEGIN,
});

export const requestNameChangeSuccess = () => ({
  type: REQUEST_NAME_CHANGE.SUCCESS,
});

export const requestNameChangeFailure = errors => ({
  type: REQUEST_NAME_CHANGE.FAILURE,
  payload: { errors },
});

export const requestNameChangeReset = () => ({
  type: REQUEST_NAME_CHANGE.RESET,
});
