import { put, call, takeEvery } from 'redux-saga/effects';

import { resetPasswordBegin, resetPasswordSuccess, RESET_PASSWORD } from './actions';
import postResetPassword from './service';

function* handleResetPassword(action) {
  yield put(resetPasswordBegin());
  const response = yield call(postResetPassword, action.payload.email);
  yield put(resetPasswordSuccess(response));
}

export default function* saga() {
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
}
