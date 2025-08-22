import {
  all,
  call,
  delay,
  put,
  takeEvery,
} from 'redux-saga/effects';

import { getAuthenticatedUser, getLocale, handleRtl, LOCALE_CHANGED, publish } from '@openedx/frontend-base';

// Actions
import {
  beginNameChange,
  closeForm,
  FETCH_SETTINGS,
  FETCH_TIME_ZONES,
  fetchSettingsBegin,
  fetchSettingsFailure,
  fetchSettingsSuccess,
  fetchTimeZones,
  fetchTimeZonesSuccess,
  SAVE_MULTIPLE_SETTINGS,
  SAVE_SETTINGS,
  saveMultipleSettingsBegin,
  saveMultipleSettingsFailure,
  saveMultipleSettingsSuccess,
  savePreviousSiteLanguage,
  saveSettingsBegin,
  saveSettingsFailure,
  saveSettingsSuccess,
} from './actions';

// Sub-modules
import {
  patchPreferences,
  postSetLang,
  saga as siteLanguageSaga,
} from '../site-language';

// Services
import {
  getSettings,
  getTimeZones,
  getVerifiedNameHistory,
  patchSettings,
} from './service';

export function* handleFetchSettings() {
  try {
    yield put(fetchSettingsBegin());
    const { username, userId, roles: userRoles } = getAuthenticatedUser();

    const {
      thirdPartyAuthProviders, profileDataManager, timeZones, countries, ...values
    } = yield call(
      getSettings,
      username,
      userRoles,
      userId,
    );

    const verifiedNameHistory = yield call(getVerifiedNameHistory);

    if (values.country) {
      yield put(fetchTimeZones(values.country));
    }

    yield put(fetchSettingsSuccess({
      values,
      thirdPartyAuthProviders,
      profileDataManager,
      timeZones,
      verifiedNameHistory,
      countriesCodesList: countries,
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
    const { commitValues, formId, extendedProfile } = action.payload;
    const commitData = Object.keys(extendedProfile).length > 0 ? extendedProfile : { [formId]: commitValues };
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
    if (savedValues.country) {
      yield put(fetchTimeZones(savedValues.country));
    }
    yield delay(1000);
    yield put(closeForm(action.payload.formId));
  } catch (e) {
    if (e.fieldErrors) {
      if (e.fieldErrors.name?.includes('verification')) {
        yield put(beginNameChange('name'));
      }
      yield put(saveSettingsFailure({ fieldErrors: e.fieldErrors }));
    } else {
      yield put(saveSettingsFailure(e.message));
      throw e;
    }
  }
}

// handles mutiple settings saved at once, in order, and stops executing on first failure.
export function* handleSaveMultipleSettings(action) {
  try {
    yield put(saveMultipleSettingsBegin());
    const { username, userId } = getAuthenticatedUser();
    const { settingsArray, form } = action.payload;
    for (const setting of settingsArray) {
      const { formId, commitValues } = setting;
      yield put(saveSettingsBegin());
      const commitData = { [formId]: commitValues };
      const savedSettings = yield call(patchSettings, username, commitData, userId);
      yield put(saveSettingsSuccess(savedSettings, commitData));
    }
    yield put(saveMultipleSettingsSuccess(action));
    if (form) {
      yield delay(1000);
      yield put(closeForm(form));
    }
  } catch (e) {
    if (e.fieldErrors) {
      if (e.fieldErrors.name?.includes('verification')) {
        yield put(beginNameChange('name'));
      }
      yield put(saveMultipleSettingsFailure({ fieldErrors: e.fieldErrors }));
    } else {
      yield put(saveMultipleSettingsFailure(e.message));
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
  yield takeEvery(SAVE_SETTINGS.BASE, handleSaveSettings);
  yield takeEvery(SAVE_MULTIPLE_SETTINGS.BASE, handleSaveMultipleSettings);
  yield takeEvery(FETCH_TIME_ZONES.BASE, handleFetchTimeZones);
  yield all([
    // deleteAccountSaga(),
    siteLanguageSaga(),
    // nameChangeSaga(),
  ]);
}
