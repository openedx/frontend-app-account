import { put } from 'redux-saga/effects';
import { logAPIErrorResponse } from '@edx/frontend-logging';
import { App } from '@edx/frontend-base';

export default function* handleFailure(error, failureAction = null, failureRedirectPath = null) {
  if (error.fieldErrors && failureAction !== null) {
    yield put(failureAction({ fieldErrors: error.fieldErrors }));
  }
  logAPIErrorResponse(error);
  if (failureAction !== null) {
    yield put(failureAction(error.message));
  }
  if (failureRedirectPath !== null) {
    App.history.push(failureRedirectPath);
  }
}
