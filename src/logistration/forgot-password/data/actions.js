import { AsyncActionType } from '../../data/utils';

export const FORGOT_PASSWORD = new AsyncActionType('FORGOT', 'PASSWORD');

// Forgot Password
export const forgotPassword = email => ({
  type: FORGOT_PASSWORD.BASE,
  payload: { email },
});

export const forgotPasswordBegin = () => ({
  type: FORGOT_PASSWORD.BEGIN,
});

export const forgotPasswordSuccess = email => ({
  type: FORGOT_PASSWORD.SUCCESS,
  payload: { email },
});

export const forgotPasswordForbidden = () => ({
  type: FORGOT_PASSWORD.FORBIDDEN,
});
