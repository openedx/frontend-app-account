import { call, put, takeEvery } from 'redux-saga/effects';

// Actions
import {
  REGISTER_NEW_USER,
  registerNewUserBegin,
  registerNewUserFailure,
  registerNewUserSuccess,
  LOGIN_REQUEST,
  loginRequestBegin,
  loginRequestFailure,
  loginRequestSuccess,
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

export function* handleLoginRequest(action) {
  try {
    yield put(loginRequestBegin());

    yield call(postNewUser, action.payload.registrationInfo);

    yield put(loginRequestSuccess());
  } catch (e) {
    yield put(loginRequestFailure());
    throw e;
  }
}

export default function* saga() {
  yield takeEvery(REGISTER_NEW_USER.BASE, handleNewUserRegistration);
  yield takeEvery(LOGIN_REQUEST.BASE, handleLoginRequest);
}
