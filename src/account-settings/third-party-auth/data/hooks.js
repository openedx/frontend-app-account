import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logError } from '@openedx/frontend-base';

import { accountSettingsKeys, accountSettingsMutationKeys } from '../../data/queryKeys';
import { postDisconnectAuth } from './api';

/**
 * Unlinks a provider. The mutation stays pending until the providers have been refetched, so the
 * button only reads "complete" once the list reflects the change.
 */
export const useDisconnectAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: accountSettingsMutationKeys.disconnectAuth,
    mutationFn: ({ url }) => postDisconnectAuth(url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountSettingsKeys.thirdPartyAuthProviders }),
    onError: (error) => {
      logError(error);
    },
  });
};
