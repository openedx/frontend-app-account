import { put, call, takeEvery } from 'redux-saga/effects';

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
    if (e.response.status === 403) {
      yield put(deleteAccountFailure('invalid-password'));
    } else if (typeof e.response.data === 'string') {
      yield put(deleteAccountFailure());
    } else {
      throw e;
    }
  }
}

export default function* saga() {
  yield takeEvery(DELETE_ACCOUNT.BASE, handleDeleteAccount);
}
