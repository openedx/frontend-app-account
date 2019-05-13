import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchSiteLanguagesBegin,
  fetchSiteLanguagesSuccess,
  fetchSiteLanguagesFailure,
  FETCH_SITE_LANGUAGES,
} from './actions';

import { ApiService } from './service';
import handleFailure from '../common/sagaUtils';

function* handleFetchSiteLanguages() {
  try {
    yield put(fetchSiteLanguagesBegin());

    const siteLanguageList = yield call(ApiService.getSiteLanguageList);
    yield put(fetchSiteLanguagesSuccess(siteLanguageList));
  } catch (e) {
    yield call(handleFailure, e, fetchSiteLanguagesFailure);
  }
}

export default function* saga() {
  yield takeEvery(FETCH_SITE_LANGUAGES.BASE, handleFetchSiteLanguages);
}
