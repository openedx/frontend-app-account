import { put, call, takeEvery } from 'redux-saga/effects';

import {
  resetPasswordBegin, resetPasswordForbidden, resetPasswordSuccess, RESET_PASSWORD,
} from './actions';
import { postResetPassword } from './service';

function* handleResetPassword(action) {
  yield put(resetPasswordBegin());
  try {
    const response = yield call(postResetPassword, action.payload.email);
    yield put(resetPasswordSuccess(response));
  } catch (error) {
    if (error.response && error.response.status === 403) {
      yield put(resetPasswordForbidden(error));
    } else {
      throw error;
    }
  }
}

export default function* saga() {
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
}
