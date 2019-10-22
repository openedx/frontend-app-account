import { AsyncActionType } from '../../data/utils';

export const DISCONNECT_AUTH = new AsyncActionType('ACCOUNT_SETTINGS', 'DISCONNECT_AUTH');

export const disconnectAuth = (url, providerId) => ({
  type: DISCONNECT_AUTH.BASE, payload: { url, providerId },
});
export const disconnectAuthBegin = providerId => ({
  type: DISCONNECT_AUTH.BEGIN, payload: { providerId },
});
export const disconnectAuthSuccess = (providerId, thirdPartyAuthProviders) => ({
  type: DISCONNECT_AUTH.SUCCESS,
  payload: { providerId, thirdPartyAuthProviders },
});
export const disconnectAuthFailure = providerId => ({
  type: DISCONNECT_AUTH.FAILURE, payload: { providerId },
});
export const disconnectAuthReset = providerId => ({
  type: DISCONNECT_AUTH.RESET, payload: { providerId },
});
