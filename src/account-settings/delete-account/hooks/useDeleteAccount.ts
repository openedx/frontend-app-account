import { useMutation } from '@tanstack/react-query';
import { postDeleteAccount } from '../data/service';

const useDeleteAccount = (handleSuccess, handleError) => {
  return useMutation({
    mutationFn: postDeleteAccount,
    onSuccess: handleSuccess,
    onError: handleError,
    retry: false,
  });
};

export { useDeleteAccount };
