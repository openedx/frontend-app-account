
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';

// Actions
import {
  FETCH_EXAMPLE_DATA,
  fetchExampleDataBegin,
  fetchExampleDataSuccess,
  fetchExampleDataFailure,
} from './actions';

// Services
import * as ApiService from './service';

export function* handleFetchExampleData(action) {
  try {
    yield put(fetchExampleDataBegin());

    const data = yield call(ApiService.getData, action.payload.data);
    yield put(fetchExampleDataSuccess(data));
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchExampleDataFailure(e.message));
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_EXAMPLE_DATA.BASE, handleFetchExampleData);
}
