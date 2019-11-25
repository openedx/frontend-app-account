import { call, put, takeEvery } from 'redux-saga/effects';
import { logError } from '@edx/frontend-platform/logging';

import {
  disconnectAuthReset,
  disconnectAuthBegin,
  disconnectAuthSuccess,
  disconnectAuthFailure,
  DISCONNECT_AUTH,
} from './actions';

import {
  getThirdPartyAuthProviders,
  postDisconnectAuth,
} from './service';

function* handleDisconnectAuth(action) {
  const { providerId } = action.payload;
  try {
    yield put(disconnectAuthReset(providerId));
    yield put(disconnectAuthBegin(providerId));
    yield call(postDisconnectAuth, action.payload.url);
    const thirdPartyAuthProviders = yield call(getThirdPartyAuthProviders);
    yield put(disconnectAuthSuccess(providerId, thirdPartyAuthProviders));
  } catch (e) {
    logError(e);
    yield put(disconnectAuthFailure(providerId));
  }
}

export default function* saga() {
  yield takeEvery(DISCONNECT_AUTH.BASE, handleDisconnectAuth);
}
