import {
  REGISTER_NEW_USER,
  LOGIN_REQUEST,
} from './actions';

import { reducer as forgotPasswordReducer, FORGOT_PASSWORD } from '../forgot-password';

export const defaultState = {
  registrationResult: {},
  loginResult: {},
  forgotPassword: forgotPasswordReducer(),
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
        loginResult: action.payload,
      };
    case LOGIN_REQUEST.FAILURE:
      return {
        ...state,
      };
    case FORGOT_PASSWORD.BEGIN:
    case FORGOT_PASSWORD.SUCCESS:
    case FORGOT_PASSWORD.FORBIDDEN:
      return {
        ...state,
        forgotPassword: forgotPasswordReducer(state.forgotPassword, action),
      };
    default:
      return state;
  }
};

export default reducer;
