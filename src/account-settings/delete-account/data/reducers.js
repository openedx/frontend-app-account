import { DELETE_ACCOUNT } from './actions';

export const defaultState = {
  status: null,
  errorType: null,
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case DELETE_ACCOUNT.CONFIRMATION:
        return {
          ...state,
          status: 'confirming',
        };

      case DELETE_ACCOUNT.BEGIN:
        return {
          ...state,
          status: 'pending',
        };

      case DELETE_ACCOUNT.SUCCESS:
        return {
          ...state,
          status: 'deleted',
        };

      case DELETE_ACCOUNT.FAILURE:
        return {
          ...state,
          status: 'failed',
          errorType: action.payload.reason || 'server',
        };

      case DELETE_ACCOUNT.RESET: {
        const oldStatus = state.status;

        return {
          ...state,
          // clear the error state if applicable, otherwise don't change state
          status: oldStatus === 'failed' ? 'confirming' : oldStatus,
          errorType: null,
        };
      }

      case DELETE_ACCOUNT.CANCEL:
        return {
          ...state,
          status: null,
          errorType: null,
        };

      default:
    }
  }
  return state;
};

export default reducer;
