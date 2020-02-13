import { all } from 'redux-saga/effects';
import { saga as accountSettingsSaga } from '../account-settings';
import { saga as registrationSaga } from '../registration';

export default function* rootSaga() {
  yield all([
    accountSettingsSaga(),
    registrationSaga(),
  ]);
}
