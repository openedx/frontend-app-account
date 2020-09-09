import { FORGOT_PASSWORD } from './actions';

export const defaultState = {
  status: null,
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case FORGOT_PASSWORD.BEGIN:
        return {
          ...state,
          status: 'pending',
        };
      case FORGOT_PASSWORD.SUCCESS:
        return {
          ...state,
          ...action.payload,
          status: 'complete',
        };
      case FORGOT_PASSWORD.FORBIDDEN:
        return {
          ...state,
          status: 'forbidden',
        };
      default:
        return state;
    }
  }
  return state;
};

export default reducer;
