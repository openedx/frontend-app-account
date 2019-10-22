import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import createRootReducer from '../data/reducers';
import rootSaga from '../data/sagas';

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(),
    initialState,
    compose(applyMiddleware(thunkMiddleware, sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
