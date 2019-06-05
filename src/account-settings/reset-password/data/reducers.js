import { RESET_PASSWORD } from './actions';

export const defaultState = {
  status: null,
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case RESET_PASSWORD.BEGIN:
        return {
          ...state,
          status: 'pending',
        };
      case RESET_PASSWORD.SUCCESS:
        return {
          ...state,
          status: 'complete',
        };

      default:
    }
  }
  return state;
};

export default reducer;
