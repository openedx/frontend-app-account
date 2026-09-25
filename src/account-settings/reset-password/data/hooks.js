import { useMutation } from '@tanstack/react-query';

import { logError } from '@edx/frontend-platform/logging';

import { accountSettingsMutationKeys } from '../../data/queryKeys';
import { postResetPassword } from './api';

const isForbidden = (error) => error?.response?.status === 403;

/**
 * The status the reset button and its alerts key off: `pending` while the request runs,
 * `complete` once the email is sent, `forbidden` when the LMS refuses because a previous request
 * is still in progress.
 */
export const getResetPasswordStatus = ({
  isPending, isSuccess, isError, error,
}) => {
  if (isPending) { return 'pending'; }
  if (isSuccess) { return 'complete'; }
  if (isError && isForbidden(error)) { return 'forbidden'; }
  return null;
};

export const useResetPassword = () => useMutation({
  mutationKey: accountSettingsMutationKeys.resetPassword,
  mutationFn: (email) => postResetPassword(email),
  onError: (error) => {
    if (!isForbidden(error)) {
      logError(error);
    }
  },
});
