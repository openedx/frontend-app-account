
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';

// Actions
import {
  FETCH_FEATURE_DATA,
  fetchFeatureDataBegin,
  fetchFeatureDataSuccess,
  fetchFeatureDataFailure,
} from './actions';

// Services
import * as ApiService from './service';

export function* handleFetchFeatureData(action) {
  try {
    yield put(fetchFeatureDataBegin());

    const data = yield call(ApiService.getData, action.payload.data);
    yield put(fetchFeatureDataSuccess(data));
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchFeatureDataFailure(e.message));
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_FEATURE_DATA.BASE, handleFetchFeatureData);
}
