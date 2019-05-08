
import { call, put, delay, takeEvery, select, all } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { logAPIErrorResponse } from '@edx/frontend-logging';

// Actions
import {
  FETCH_SETTINGS,
  fetchSettingsBegin,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  closeForm,
  SAVE_SETTINGS,
  saveSettingsBegin,
  saveSettingsSuccess,
  saveSettingsFailure,
  RESET_PASSWORD,
  resetPasswordBegin,
  resetPasswordSuccess,
} from './actions';
import { usernameSelector } from './selectors';

// Services
import * as ApiService from './service';
import { ApiService as SiteLanguageApiService } from '../site-language';
import { setLocale, handleRtl } from '@edx/frontend-i18n'; // eslint-disable-line

export function* handleFetchSettings() {
  try {
    yield put(fetchSettingsBegin());
    const username = yield select(usernameSelector);

    const { thirdPartyAuthProviders, ...values } = yield call(ApiService.getSettings, username);

    yield put(fetchSettingsSuccess({ values, thirdPartyAuthProviders }));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(fetchSettingsFailure(e.message));
    yield put(push('/error'));
  }
}

export function* handleSaveSettings(action) {
  try {
    yield put(saveSettingsBegin());

    const username = yield select(usernameSelector);
    const { commitValues, formId } = action.payload;
    const commitData = { [formId]: commitValues };
    let savedValues = null;
    if (formId === 'siteLanguage') {
      yield all([
        call(SiteLanguageApiService.patchPreferences, username, { prefLang: commitValues }),
        call(SiteLanguageApiService.postSetLang, commitValues),
      ]);
      yield put(setLocale(commitValues));
      handleRtl();
      savedValues = commitValues;
    } else {
      savedValues = yield call(ApiService.patchSettings, username, commitData);
    }
    yield put(saveSettingsSuccess(savedValues, commitData));
    yield delay(1000);
    yield put(closeForm(action.payload.formId));
  } catch (e) {
    if (e.fieldErrors) {
      yield put(saveSettingsFailure({ fieldErrors: e.fieldErrors }));
    } else {
      logAPIErrorResponse(e);
      yield put(saveSettingsFailure(e.message));
      yield put(push('/error'));
    }
  }
}

export function* handleResetPassword() {
  try {
    yield put(resetPasswordBegin());
    const response = yield call(ApiService.postResetPassword);
    yield put(resetPasswordSuccess(response));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_SETTINGS.BASE, handleFetchSettings);
  yield takeEvery(SAVE_SETTINGS.BASE, handleSaveSettings);
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
}
