import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthenticatedUser } from '@openedx/frontend-base';

import { postVerifiedName } from '@src/account-settings/data/api';
import { accountSettingsKeys, accountSettingsMutationKeys } from '@src/account-settings/data/queryKeys';
import { postNameChange } from '@src/account-settings/name-change/data/api';

export const GENERAL_ERROR = { general_error: 'A technical error occurred. Please try again.' };

/**
 * The LMS reports validation problems as a JSON body on the error; anything else is a general
 * failure.
 */
export const getNameChangeErrors = (error) => {
  const body = error?.customAttributes?.httpErrorResponseData;
  if (!body) {
    return GENERAL_ERROR;
  }
  try {
    return JSON.parse(body);
  } catch (e) {
    return GENERAL_ERROR;
  }
};

/**
 * Requests a verified name, optionally alongside a pending profile name change. Both land in the
 * verified name history and the account (as `pending_name_change`), so both are refetched.
 */
export const useRequestNameChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: accountSettingsMutationKeys.requestNameChange,
    mutationFn: async ({ username, profileName, verifiedName }) => {
      let { name } = getAuthenticatedUser();
      if (profileName) {
        await postNameChange(profileName);
        name = profileName;
      }
      await postVerifiedName({
        username,
        verified_name: verifiedName,
        profile_name: name,
      });
    },
    onSuccess: (data, { username }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: accountSettingsKeys.verifiedNameHistory }),
      queryClient.invalidateQueries({ queryKey: accountSettingsKeys.values(username) }),
    ]),
  });
};
