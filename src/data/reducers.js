import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import { reducer as i18nReducer } from '@edx/frontend-i18n';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const createRootReducer = () =>
  combineReducers({
    // The authentication state is added as initialState when
    // creating the store in data/store.js.
    authentication: identityReducer,
    configuration: identityReducer,
    errors: identityReducer,
    i18n: i18nReducer,
    userAccount,
    [accountSettingsStoreName]: accountSettingsReducer,
  });

export default createRootReducer;
