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
  savePreviousSiteLanguage,
  FETCH_TIME_ZONES,
  fetchTimeZones,
  fetchTimeZonesSuccess,
  DISCONNECT_AUTH,
  disconnectAuthBegin,
  disconnectAuthSuccess,
  disconnectAuthFailure,
  disconnectAuthReset,
} from './actions';
import { usernameSelector, userRolesSelector, siteLanguageSelector } from './selectors';

// Sub-modules
import { saga as deleteAccountSaga } from './delete-account';
import { saga as resetPasswordSaga } from './reset-password';
import { saga as siteLanguageSaga, ApiService as SiteLanguageApiService } from './site-language';

// Services
import * as ApiService from './service';

import { setLocale, handleRtl } from '@edx/frontend-i18n'; // eslint-disable-line

export function* handleFetchSettings() {
  try {
    yield put(fetchSettingsBegin());
    const username = yield select(usernameSelector);
    const userRoles = yield select(userRolesSelector);

    const {
      thirdPartyAuthProviders, profileDataManager, timeZones, ...values
    } = yield call(
      ApiService.getSettings,
      username,
      userRoles,
    );

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
  const { providerId } = action.payload;
  try {
    yield put(disconnectAuthReset(providerId));
    yield put(disconnectAuthBegin(providerId));
    yield call(ApiService.postDisconnectAuth, action.payload.url);
    const thirdPartyAuthProviders = yield call(ApiService.getThirdPartyAuthProviders);
    yield put(disconnectAuthSuccess(providerId, thirdPartyAuthProviders));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(disconnectAuthFailure(providerId));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_SETTINGS.BASE, handleFetchSettings);
  yield takeEvery(SAVE_SETTINGS.BASE, handleSaveSettings);
  yield takeEvery(FETCH_TIME_ZONES.BASE, handleFetchTimeZones);
  yield takeEvery(DISCONNECT_AUTH.BASE, handleDisconnectAuth);
  yield all([
    deleteAccountSaga(),
    siteLanguageSaga(),
    resetPasswordSaga(),
  ]);
}
