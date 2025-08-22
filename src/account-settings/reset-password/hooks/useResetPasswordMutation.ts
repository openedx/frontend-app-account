import { useMutation } from '@tanstack/react-query';
import { postResetPassword } from '../data/service';

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: postResetPassword,
  });
};
