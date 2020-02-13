import { call, put, takeEvery } from 'redux-saga/effects';

// Actions
import {
  REGISTER_NEW_USER,
  registerNewUserBegin,
  registerNewUserFailure,
  registerNewUserSuccess,
} from './actions';


// Services
import postNewUser from './service';

export function* handleNewUserRegistration(action) {
  try {
    yield put(registerNewUserBegin());

    yield call(postNewUser, action.payload.registrationInfo);

    yield put(registerNewUserSuccess());
  } catch (e) {
    yield put(registerNewUserFailure());
    throw e;
  }
}

export default function* saga() {
  yield takeEvery(REGISTER_NEW_USER.BASE, handleNewUserRegistration);
}
