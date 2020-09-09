import { combineReducers } from 'redux';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';

import {
  reducer as logistrationReducer,
  storeName as logistrationStoreName,
} from '../logistration';

const createRootReducer = () => combineReducers({
  [accountSettingsStoreName]: accountSettingsReducer,
  [logistrationStoreName]: logistrationReducer,
});
export default createRootReducer;
