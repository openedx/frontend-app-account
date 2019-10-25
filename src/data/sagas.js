import { all } from 'redux-saga/effects';
import { saga as accountSettingsSaga } from '../account-settings';

export default function* rootSaga() {
  yield all([accountSettingsSaga()]);
}
