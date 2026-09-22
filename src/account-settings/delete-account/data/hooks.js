import { useMutation } from '@tanstack/react-query';

import { logError } from '@edx/frontend-platform/logging';

import { accountSettingsMutationKeys } from '../../data/queryKeys';
import { postDeleteAccount } from './api';

/**
 * A 403 means the password was wrong, which the modal reports as such. Anything else is a
 * server-side failure, logged and reported generically.
 */
export const getDeleteAccountErrorType = (error) => (
  error?.response?.status === 403 ? 'invalid-password' : 'server'
);

export const useDeleteAccount = () => useMutation({
  mutationKey: accountSettingsMutationKeys.deleteAccount,
  mutationFn: (password) => postDeleteAccount(password),
  onError: (error) => {
    if (getDeleteAccountErrorType(error) === 'server') {
      logError(error);
    }
  },
});
