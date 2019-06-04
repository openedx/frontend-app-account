import { put, push, call, takeEvery } from 'redux-saga/effects';
import { logAPIErrorResponse } from '@edx/frontend-logging';

import {
  DELETE_ACCOUNT,
  deleteAccountBegin,
  deleteAccountSuccess,
  deleteAccountFailure,
} from './actions';

import { postDeleteAccount } from './service';

export function* handleDeleteAccount(action) {
  try {
    yield put(deleteAccountBegin());
    const response = yield call(postDeleteAccount, action.payload.password);
    yield put(deleteAccountSuccess(response));
  } catch (e) {
    if (typeof e.response.data === 'string') {
      yield put(deleteAccountFailure());
    } else {
      logAPIErrorResponse(e);
      yield put(push('/error'));
    }
  }
}

export default function* saga() {
  yield takeEvery(DELETE_ACCOUNT.BASE, handleDeleteAccount);
}
