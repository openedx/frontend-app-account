import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import { connectRouter } from 'connected-react-router';
import {
  reducer as featureReducer,
  storeName as featureStoreName,
} from './feature';

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
    userAccount,
    [featureStoreName]: featureReducer,
    router: connectRouter(history),
  });

export default createRootReducer;
