import { combineReducers } from 'redux';

import {
  reducer as accountSettingsReducer,
  storeName as accountSettingsStoreName,
} from '../account-settings';

const createRootReducer = () => combineReducers({
  [accountSettingsStoreName]: accountSettingsReducer,
});
export default createRootReducer;
