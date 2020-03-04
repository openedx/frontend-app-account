import { call, put, delay, takeEvery, all, debounce } from 'redux-saga/effects';

import { publish } from '@edx/frontend-platform';
import { getLocale, handleRtl, LOCALE_CHANGED } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

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
} from './actions';

// Sub-modules
import { saga as deleteAccountSaga } from '../delete-account';
import { saga as resetPasswordSaga } from '../reset-password';
import {
  saga as siteLanguageSaga,
  patchPreferences,
  postSetLang,
} from '../site-language';
import { saga as thirdPartyAuthSaga } from '../third-party-auth';

// Services
import { getSettings, patchSettings, getTimeZones } from './service';

export function* handleFetchSettings() {
  try {
    yield put(fetchSettingsBegin());
    const { username, userId, roles: userRoles } = getAuthenticatedUser();

    const {
      thirdPartyAuthProviders, profileDataManager, timeZones, ...values
    } = yield call(
      getSettings,
      username,
      userRoles,
      userId,
    );

    if (values.country) yield put(fetchTimeZones(values.country));

    yield put(fetchSettingsSuccess({
      values,
      thirdPartyAuthProviders,
      profileDataManager,
      timeZones,
    }));
  } catch (e) {
    yield put(fetchSettingsFailure(e.message));
    throw e;
  }
}

export function* handleSaveSettings(action) {
  try {
    yield put(saveSettingsBegin());

    const { username, userId } = getAuthenticatedUser();
    const { commitValues, formId } = action.payload;
    const commitData = { [formId]: commitValues };
    let savedValues = null;
    if (formId === 'siteLanguage') {
      const previousSiteLanguage = getLocale();
      // The following two requests need to be done sequentially, with patching preferences before
      // the post to setlang.  They used to be done in parallel, but this might create ambiguous
      // behavior.
      yield call(patchPreferences, username, { prefLang: commitValues });
      yield call(postSetLang, commitValues);

      yield put(savePreviousSiteLanguage(previousSiteLanguage));

      publish(LOCALE_CHANGED, getLocale());
      handleRtl();
      savedValues = commitData;
    } else {
      savedValues = yield call(patchSettings, username, commitData, userId);
    }
    yield put(saveSettingsSuccess(savedValues, commitData));
    if (savedValues.country) yield put(fetchTimeZones(savedValues.country));
    yield delay(1000);
    yield put(closeForm(action.payload.formId));
  } catch (e) {
    if (e.fieldErrors) {
      yield put(saveSettingsFailure({ fieldErrors: e.fieldErrors }));
    } else {
      yield put(saveSettingsFailure(e.message));
      throw e;
    }
  }
}

export function* handleFetchTimeZones(action) {
  const response = yield call(getTimeZones, action.payload.country);
  yield put(fetchTimeZonesSuccess(response, action.payload.country));
}


export default function* saga() {
  yield takeEvery(FETCH_SETTINGS.BASE, handleFetchSettings);
  yield debounce(500, SAVE_SETTINGS.BASE, handleSaveSettings);
  yield takeEvery(FETCH_TIME_ZONES.BASE, handleFetchTimeZones);
  yield all([
    deleteAccountSaga(),
    siteLanguageSaga(),
    resetPasswordSaga(),
    thirdPartyAuthSaga(),
  ]);
}
