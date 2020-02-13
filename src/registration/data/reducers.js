import {
  REGISTER_NEW_USER,
  LOGIN_REQUEST,
} from './actions';

export const defaultState = {
  registrationResult: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTER_NEW_USER.BEGIN:
      return {
        ...state,
      };
    case REGISTER_NEW_USER.SUCCESS:
      return {
        ...state,
      };
    case REGISTER_NEW_USER.FAILURE:
      return {
        ...state,
      };
    case LOGIN_REQUEST.BEGIN:
      return {
        ...state,
      };
    case LOGIN_REQUEST.SUCCESS:
      return {
        ...state,
      };
    case LOGIN_REQUEST.FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
