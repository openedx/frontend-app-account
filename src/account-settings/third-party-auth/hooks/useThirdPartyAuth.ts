import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getThirdPartyAuthProviders, postDisconnectAuth } from '../data/service';

export const useThirdPartyAuthProviders = () => {
  return useQuery({
    queryKey: ['third-party-auth', 'providers'],
    queryFn: getThirdPartyAuthProviders,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useDisconnectAuth = () => {
  const queryClient = useQueryClient();
  const [disconnectionStatuses, setDisconnectionStatuses] = useState({});
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async ({ url, providerId }: { url: string, providerId: string }) => {
      setDisconnectionStatuses(prev => ({ ...prev, [providerId]: 'pending' }));
      setErrors(prev => ({ ...prev, [providerId]: false }));

      await postDisconnectAuth(url);
      return providerId;
    },
    onSuccess: (providerId) => {
      setDisconnectionStatuses(prev => ({ ...prev, [providerId]: 'complete' }));
      setErrors(prev => ({ ...prev, [providerId]: false }));

      // Invalidate and refetch providers after successful disconnect
      queryClient.invalidateQueries({
        queryKey: ['third-party-auth', 'providers'],
      });

      // Reset status after a short delay
      setTimeout(() => {
        setDisconnectionStatuses(prev => ({ ...prev, [providerId]: null }));
      }, 2000);
    },
    onError: (error, { providerId }) => {
      setDisconnectionStatuses(prev => ({ ...prev, [providerId]: 'error' }));
      setErrors(prev => ({ ...prev, [providerId]: true, error }));
    },
  });

  return {
    ...mutation,
    disconnectionStatuses,
    errors,
  };
};
