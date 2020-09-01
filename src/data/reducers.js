import { combineReducers } from 'redux';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';

import {
  reducer as registrationReducer,
} from '../logistration';

const createRootReducer = () => combineReducers({
  [accountSettingsStoreName]: accountSettingsReducer,
  registration: registrationReducer,
});
export default createRootReducer;
