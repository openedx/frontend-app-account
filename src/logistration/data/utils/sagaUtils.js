import { put } from 'redux-saga/effects';
import { logError } from '@edx/frontend-platform/logging';
import { history } from '@edx/frontend-platform';

export default function* handleFailure(error, failureAction = null, failureRedirectPath = null) {
  if (error.fieldErrors && failureAction !== null) {
    yield put(failureAction({ fieldErrors: error.fieldErrors }));
  }
  logError(error);
  if (failureAction !== null) {
    yield put(failureAction(error.message));
  }
  if (failureRedirectPath !== null) {
    history.push(failureRedirectPath);
  }
}
