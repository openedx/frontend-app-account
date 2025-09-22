import { getAuthenticatedUser } from '@openedx/frontend-base';
import { useMutation } from '@tanstack/react-query';
import { postVerifiedName } from '../../data/service';
import { postNameChange } from '../data/service';

const useNameChangeMutation = (handleSuccess, handleError) => {
  return useMutation({
    mutationFn: async (variables: { username: string, profileName?: string, verifiedName: string }) => {
      const { username, profileName: profileNameProp, verifiedName } = variables;
      let { name: profileName } = getAuthenticatedUser();
      if (profileNameProp) {
        await postNameChange(profileNameProp);
        profileName = profileNameProp;
      }
      await postVerifiedName({
        username: username,
        verified_name: verifiedName,
        profile_name: profileName,
      });
    },
    onSuccess: handleSuccess,
    onError: handleError,
    retry: false,
  });
};

export { useNameChangeMutation };
