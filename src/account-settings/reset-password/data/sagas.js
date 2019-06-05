import { put, call, push, takeEvery } from 'redux-saga/effects';
import { logAPIErrorResponse } from '@edx/frontend-logging';

import { resetPasswordBegin, resetPasswordSuccess, RESET_PASSWORD } from './actions';
import { postResetPassword } from './service';

function* handleResetPassword(action) {
  try {
    yield put(resetPasswordBegin());
    const response = yield call(postResetPassword, action.payload.email);
    yield put(resetPasswordSuccess(response));
  } catch (e) {
    logAPIErrorResponse(e);
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
}
