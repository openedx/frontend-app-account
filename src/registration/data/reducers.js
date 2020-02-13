import {
  REGISTER_NEW_USER,
} from './actions';

import { reducer as deleteAccountReducer, DELETE_ACCOUNT } from '../delete-account';
import { reducer as siteLanguageReducer, FETCH_SITE_LANGUAGES } from '../site-language';
import { reducer as resetPasswordReducer, RESET_PASSWORD } from '../reset-password';
import { reducer as thirdPartyAuthReducer, DISCONNECT_AUTH } from '../third-party-auth';

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
