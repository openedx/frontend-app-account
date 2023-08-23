import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchSiteLanguagesBegin,
  fetchSiteLanguagesSuccess,
  fetchSiteLanguagesFailure,
  FETCH_SITE_LANGUAGES,
} from './actions';

import { getSiteLanguageList } from './service';
import { handleFailure } from '../data/utils';

function* handleFetchSiteLanguages(action) {
  try {
    yield put(fetchSiteLanguagesBegin());
    const siteLanguageList = yield call(getSiteLanguageList);
    yield put(fetchSiteLanguagesSuccess(siteLanguageList));
  } catch (e) {
    yield call(handleFailure, e, action.payload.handleNavigation, fetchSiteLanguagesFailure);
  }
}

export default function* saga() {
  yield takeEvery(FETCH_SITE_LANGUAGES.BASE, handleFetchSiteLanguages);
}
