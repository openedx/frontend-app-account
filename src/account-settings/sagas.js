
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';

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
} from './actions';
import { getUsername } from './selectors';

// Services
import * as ApiService from './service';

export function* handleFetchAccount() {
  try {
    yield put(fetchAccountBegin());

    const username = yield select(getUsername);
    const values = yield call(ApiService.getAccount, username);
    yield put(fetchAccountSuccess(values));
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchAccountFailure(e.message));
    yield put(push('/error'));
  }
}

export function* handleSaveAccount(action) {
  try {
    yield put(saveAccountBegin());

    const username = yield select(getUsername);
    const { commitValues } = action.payload;
    const savedValues = yield call(ApiService.patchAccount, username, commitValues);

    yield put(saveAccountSuccess(savedValues));
    yield put(closeForm(action.payload.formId));
  } catch (e) {
    if (e.fieldErrors) {
      yield put(saveAccountFailure({
        fieldErrors: e.fieldErrors,
      }));
    } else {
      LoggingService.logAPIErrorResponse(e);
      yield put(saveAccountFailure(e.message));
      yield put(push('/error'));
    }
  }
}

export default function* saga() {
  yield takeEvery(FETCH_ACCOUNT.BASE, handleFetchAccount);
  yield takeEvery(SAVE_ACCOUNT.BASE, handleSaveAccount);
}
