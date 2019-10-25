import { AsyncActionType } from '../../data/utils';

export const DELETE_ACCOUNT = new AsyncActionType('ACCOUNT_SETTINGS', 'DELETE_ACCOUNT');
DELETE_ACCOUNT.CONFIRMATION = 'ACCOUNT_SETTINGS__DELETE_ACCOUNT__CONFIRMATION';
DELETE_ACCOUNT.CANCEL = 'ACCOUNT_SETTINGS__DELETE_ACCOUNT__CANCEL';

export const deleteAccount = password => ({
  type: DELETE_ACCOUNT.BASE,
  payload: { password },
});

export const deleteAccountConfirmation = () => ({
  type: DELETE_ACCOUNT.CONFIRMATION,
});

export const deleteAccountBegin = () => ({
  type: DELETE_ACCOUNT.BEGIN,
});

export const deleteAccountSuccess = () => ({
  type: DELETE_ACCOUNT.SUCCESS,
});

export const deleteAccountFailure = reason => ({
  type: DELETE_ACCOUNT.FAILURE,
  payload: { reason },
});

// to clear errors from the confirmation modal
export const deleteAccountReset = () => ({
  type: DELETE_ACCOUNT.RESET,
});

// to close the modal
export const deleteAccountCancel = () => ({
  type: DELETE_ACCOUNT.CANCEL,
});
