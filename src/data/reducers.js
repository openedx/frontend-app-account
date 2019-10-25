import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import { reducer as i18nReducer } from '@edx/frontend-i18n';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';

const createRootReducer = () =>
  combineReducers({
    i18n: i18nReducer,
    userAccount,
    [accountSettingsStoreName]: accountSettingsReducer,
  });

export default createRootReducer;
