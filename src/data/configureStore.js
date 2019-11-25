import { getConfig } from '@edx/frontend-platform';
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import createRootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

function composeMiddleware() {
  if (getConfig().ENVIRONMENT === 'development') {
    const loggerMiddleware = createLogger({
      collapsed: true,
    });
    return composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware));
  }

  return compose(applyMiddleware(thunkMiddleware, sagaMiddleware));
}

export default function configureStore(initialState = {}) {
  const store = createStore(
    createRootReducer(),
    initialState,
    composeMiddleware(),
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
