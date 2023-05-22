import { combineReducers } from 'redux';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';
import notificationPreferencesReducer from '../notification-preferences/data/reducers';

const createRootReducer = () => combineReducers({
  [accountSettingsStoreName]: accountSettingsReducer,
  notificationPreferences: notificationPreferencesReducer,
});
export default createRootReducer;
