import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import { connectRouter } from 'connected-react-router';

import { reducer as i18nReducer } from '@edx/frontend-i18n'; // eslint-disable-line

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from './account-settings';

import {
  reducer as siteLanguageReducer,
  storeName as siteLanguageStoreName,
} from './site-language';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const createRootReducer = history =>
  combineReducers({
    // The authentication state is added as initialState when
    // creating the store in data/store.js.
    authentication: identityReducer,
    configuration: identityReducer,
    errors: identityReducer,
    i18n: i18nReducer,
    userAccount,
    [accountSettingsStoreName]: accountSettingsReducer,
    [siteLanguageStoreName]: siteLanguageReducer,
    router: connectRouter(history),
  });

export default createRootReducer;
