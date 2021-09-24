import { put, call, takeEvery } from 'redux-saga/effects';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { postVerifiedName } from '../../data/service';

import {
  REQUEST_NAME_CHANGE,
  requestNameChangeBegin,
  requestNameChangeSuccess,
  requestNameChangeFailure,
} from './actions';
import { postNameChange } from './service';

export function* handleRequestNameChange(action) {
  let { name: profileName } = getAuthenticatedUser();
  try {
    yield put(requestNameChangeBegin());
    if (action.payload.profileName) {
      yield call(postNameChange, action.payload.profileName);
      profileName = action.payload.profileName;
    }
    yield call(postVerifiedName, {
      username: action.payload.username,
      verified_name: action.payload.verifiedName,
      profile_name: profileName,
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
