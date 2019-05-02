
import { call, put, delay, takeEvery, select, all } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { LoggingService, logAPIErrorResponse } from '@edx/frontend-logging';

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
  savePreviousSiteLanguage,
  RESET_PASSWORD,
  resetPasswordBegin,
  resetPasswordSuccess,
  FETCH_TIME_ZONES,
  fetchTimeZones,
  fetchTimeZonesSuccess,
  DISCONNECT_AUTH,
  disconnectAuthBegin,
  disconnectAuthSuccess,
  disconnectAuthFailure,
  disconnectAuthReset,
  DELETE_ACCOUNT,
  deleteAccountBegin,
  deleteAccountSuccess,
  deleteAccountFailure,
} from './actions';
import { usernameSelector, userRolesSelector, siteLanguageSelector } from './selectors';

// Services
import * as ApiService from './service';
import { ApiService as SiteLanguageApiService } from '../site-language';
import { setLocale, handleRtl } from '@edx/frontend-i18n'; // eslint-disable-line

export function* handleFetchSettings() {
  try {
    yield put(fetchSettingsBegin());
    const username = yield select(usernameSelector);
    const userRoles = yield select(userRolesSelector);

    const {
      thirdPartyAuthProviders,
      profileDataManager,
      timeZones,
      ...values
    } = yield call(ApiService.getSettings, username, userRoles);

    if (values.country) yield put(fetchTimeZones(values.country));

    yield put(fetchSettingsSuccess({
      values,
      thirdPartyAuthProviders,
      profileDataManager,
      timeZones,
    }));
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
      const previousSiteLanguage = yield select(siteLanguageSelector);
      yield all([
        call(SiteLanguageApiService.patchPreferences, username, { prefLang: commitValues }),
        call(SiteLanguageApiService.postSetLang, commitValues),
      ]);
      yield put(setLocale(commitValues));
      yield put(savePreviousSiteLanguage(previousSiteLanguage.savedValue));
      handleRtl();
      savedValues = commitData;
    } else {
      savedValues = yield call(ApiService.patchSettings, username, commitData);
    }
    yield put(saveSettingsSuccess(savedValues, commitData));
    if (savedValues.country) yield put(fetchTimeZones(savedValues.country));
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

export function* handleDeleteAccount(action) {
  try {
    yield put(deleteAccountBegin());
    const response = yield call(ApiService.postDeleteAccount, action.payload.password);
    yield put(deleteAccountSuccess(response));
  } catch (e) {
    if (typeof e.response.data === 'string') {
      yield put(deleteAccountFailure());
    } else {
      LoggingService.logAPIErrorResponse(e);
      yield put(push('/error'));
    }
  }
}

export function* handleResetPassword(action) {
  try {
    yield put(resetPasswordBegin());
    const response = yield call(ApiService.postResetPassword, action.payload.email);
    yield put(resetPasswordSuccess(response));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(push('/error'));
  }
}

export function* handleFetchTimeZones(action) {
  try {
    const response = yield call(ApiService.getTimeZones, action.payload.country);
    yield put(fetchTimeZonesSuccess(response, action.payload.country));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(push('/error'));
  }
}

export function* handleDisconnectAuth(action) {
  try {
    yield put(disconnectAuthReset());
    yield put(disconnectAuthBegin());
    yield call(ApiService.postDisconnectAuth, action.payload.url);
    const thirdPartyAuthProviders = yield call(ApiService.getThirdPartyAuthProviders);
    yield put(disconnectAuthSuccess(thirdPartyAuthProviders));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(disconnectAuthFailure(action.payload.providerId));
  }
}


export default function* saga() {
  yield takeEvery(FETCH_SETTINGS.BASE, handleFetchSettings);
  yield takeEvery(SAVE_SETTINGS.BASE, handleSaveSettings);
  yield takeEvery(DELETE_ACCOUNT.BASE, handleDeleteAccount);
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
  yield takeEvery(FETCH_TIME_ZONES.BASE, handleFetchTimeZones);
  yield takeEvery(DISCONNECT_AUTH.BASE, handleDisconnectAuth);
}
