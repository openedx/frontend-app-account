import { all } from 'redux-saga/effects';
import { saga as featureSaga } from './feature';

export default function* rootSaga() {
  yield all([
    featureSaga(),
  ]);
}
