import { AsyncActionType } from '../../data/utils';

export const RESET_PASSWORD = new AsyncActionType('ACCOUNT_SETTINGS', 'RESET_PASSWORD');

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

export const resetPasswordForbidden = () => ({
  type: RESET_PASSWORD.FORBIDDEN,
});
