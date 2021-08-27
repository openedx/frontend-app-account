import { REQUEST_NAME_CHANGE } from './actions';

export const defaultState = {
  saveState: null,
  errors: {},
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case REQUEST_NAME_CHANGE.BEGIN:
        return {
          ...state,
          saveState: 'pending',
          errors: {},
        };

      case REQUEST_NAME_CHANGE.SUCCESS:
        return {
          ...state,
          saveState: 'complete',
        };

      case REQUEST_NAME_CHANGE.FAILURE:
        return {
          ...state,
          saveState: 'error',
          errors: action.payload.errors || { general_error: 'A technical error occurred. Please try again.' },
        };

      case REQUEST_NAME_CHANGE.RESET:
        return {
          ...state,
          saveState: null,
          errors: {},
        };

      default:
    }
  }
  return state;
};

export default reducer;
