
import { call, put, delay, takeEvery, select, all } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { logAPIErrorResponse } from '@edx/frontend-logging';

// Actions
import {
  FETCH_ACCOUNT,
  fetchAccountBegin,
  fetchAccountSuccess,
  fetchAccountFailure,
  closeForm,
  SAVE_ACCOUNT,
  saveAccountBegin,
  saveAccountSuccess,
  saveAccountFailure,
  RESET_PASSWORD,
  resetPasswordBegin,
  resetPasswordSuccess,
  FETCH_THIRD_PARTY_AUTH_PROVIDERS,
  fetchThirdPartyAuthProvidersBegin,
  fetchThirdPartyAuthProvidersSuccess,
  fetchThirdPartyAuthProvidersFailure,
} from './actions';
import { usernameSelector } from './selectors';

// Services
import * as ApiService from './service';
import { ApiService as SiteLanguageApiService } from '../site-language';
import { setLocale, handleRtl } from '@edx/frontend-i18n'; // eslint-disable-line

export function* handleFetchAccount() {
  try {
    yield put(fetchAccountBegin());

    const username = yield select(usernameSelector);
    const values = yield call(ApiService.getAccount, username);
    yield put(fetchAccountSuccess(values));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(fetchAccountFailure(e.message));
    yield put(push('/error'));
  }
}

export function* handleSaveAccount(action) {
  try {
    yield put(saveAccountBegin());

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
      savedValues = yield call(ApiService.patchAccount, username, commitData);
    }
    yield put(saveAccountSuccess(savedValues, commitData));
    yield delay(1000);
    yield put(closeForm(action.payload.formId));
  } catch (e) {
    if (e.fieldErrors) {
      yield put(saveAccountFailure({ fieldErrors: e.fieldErrors }));
    } else {
      logAPIErrorResponse(e);
      yield put(saveAccountFailure(e.message));
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

export function* handleFetchThirdPartyAuthProviders() {
  try {
    yield put(fetchThirdPartyAuthProvidersBegin());
    const authProviders = yield call(ApiService.getThirdPartyAuthProviders);
    yield put(fetchThirdPartyAuthProvidersSuccess(authProviders));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(fetchThirdPartyAuthProvidersFailure(e.message));
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_ACCOUNT.BASE, handleFetchAccount);
  yield takeEvery(SAVE_ACCOUNT.BASE, handleSaveAccount);
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
  yield takeEvery(FETCH_THIRD_PARTY_AUTH_PROVIDERS.BASE, handleFetchThirdPartyAuthProviders);
}
