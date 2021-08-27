import { put, call, takeEvery } from 'redux-saga/effects';

import { postVerifiedName } from '../../data/service';

import {
  REQUEST_NAME_CHANGE,
  requestNameChangeBegin,
  requestNameChangeSuccess,
  requestNameChangeFailure,
} from './actions';
import { postNameChange } from './service';

export function* handleRequestNameChange(action) {
  try {
    yield put(requestNameChangeBegin());
    yield call(postNameChange, action.payload.newName);
    yield call(postVerifiedName, {
      username: action.payload.username,
      verified_name: action.payload.verifiedName,
      profile_name: action.payload.newName,
    });
    yield put(requestNameChangeSuccess());
  } catch (err) {
    if (err.customAttributes?.httpErrorResponseData) {
      yield put(requestNameChangeFailure(JSON.parse(err.customAttributes.httpErrorResponseData)));
    } else {
      yield put(requestNameChangeFailure());
    }
  }
}

export default function* saga() {
  yield takeEvery(REQUEST_NAME_CHANGE.BASE, handleRequestNameChange);
}
