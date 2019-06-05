import { DISCONNECT_AUTH } from './actions';

export const defaultState = {
  providers: [],
  disconnectionStatuses: {},
  errors: {},
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case DISCONNECT_AUTH.BEGIN:
        return {
          ...state,
          disconnectionStatuses: {
            ...state.disconnectionStatuses,
            [action.payload.providerId]: 'pending',
          },
        };
      case DISCONNECT_AUTH.SUCCESS:
        return {
          ...state,
          disconnectionStatuses: {
            ...state.disconnectionStatuses,
            [action.payload.providerId]: 'complete',
          },
          providers: action.payload.thirdPartyAuthProviders,
        };
      case DISCONNECT_AUTH.FAILURE:
        return {
          ...state,
          disconnectionStatuses: {
            ...state.disconnectionStatuses,
            [action.payload.providerId]: 'error',
          },
          errors: {
            ...state.errors,
            [action.payload.providerId]: true,
          },
        };
      case DISCONNECT_AUTH.RESET:
        return {
          ...state,
          disconnectionStatuses: {
            ...state.disconnectionStatuses,
            [action.payload.providerId]: null,
          },
          errors: {
            ...state.errors,
            [action.payload.providerId]: null,
          },
        };
      default:
    }
  }
  return state;
};

export default reducer;
