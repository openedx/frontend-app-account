import {
  REGISTER_NEW_USER,
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
    default:
      return state;
  }
};

export default reducer;
