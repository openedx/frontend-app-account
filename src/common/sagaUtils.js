import { put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { logAPIErrorResponse } from '@edx/frontend-logging';

export default function* handleFailure(error, failureAction = null, failureRedirectPath = null) {
  if (error.fieldErrors && failureAction !== null) {
    yield put(failureAction({ fieldErrors: error.fieldErrors }));
  }
  logAPIErrorResponse(error);
  if (failureAction !== null) {
    yield put(failureAction(error.message));
  }
  if (failureRedirectPath !== null) {
    yield put(push(failureRedirectPath));
  }
}
