import { all } from 'redux-saga/effects';
import { saga as accountSettingsSaga } from './account-settings';
import { saga as siteLanguageSaga } from './site-language';

export default function* rootSaga() {
  yield all([
    accountSettingsSaga(),
    siteLanguageSaga(),
  ]);
}
