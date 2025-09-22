import { getAuthenticatedUser } from '@openedx/frontend-base';
import { useMutation } from '@tanstack/react-query';
import { patchSettings } from '../data/service';

export const useDOBMutation = () => {
  const saveSettingsMutation = useMutation({
    mutationFn: async ({
      formId,
      commitValues,
      extendedProfile = {},
    }: {
      formId: string,
      commitValues: any,
      extendedProfile?: any,
    }) => {
      const { username } = getAuthenticatedUser();
      const commitData = Object.keys(extendedProfile).length > 0
        ? extendedProfile
        : { [formId]: commitValues };
      return await patchSettings(username, commitData);
    },
    onSuccess: (_data, variables) => {
      // Store the submitted DOB flag in localStorage for DOB form
      if (variables.formId === 'extended_profile') {
        localStorage.setItem('submittedDOB', 'true');
      }
    },
  });

  return {
    ...saveSettingsMutation,
    mutateDOB: (monthValue: string, yearValue: string) => {
      const data = monthValue !== '' && yearValue !== ''
        ? [{ field_name: 'DOB', field_value: `${yearValue}-${monthValue}` }]
        : [];

      return saveSettingsMutation.mutate({
        formId: 'extended_profile',
        commitValues: data,
      });
    },
  };
};
