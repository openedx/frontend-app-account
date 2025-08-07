import { put } from 'redux-saga/effects';
import { logError } from '@openedx/frontend-base';

export default function* handleFailure(error, navigate, failureAction = null, failureRedirectPath = null) {
  if (error.fieldErrors && failureAction !== null) {
    yield put(failureAction({ fieldErrors: error.fieldErrors }));
  }
  logError(error);
  if (failureAction !== null) {
    yield put(failureAction(error.message));
  }
  if (failureRedirectPath !== null) {
    navigate(failureRedirectPath);
  }
}
