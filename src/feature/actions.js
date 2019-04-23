import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_FEATURE_DATA = new AsyncActionType('FEATURE', 'FETCH_FEATURE_DATA');

// FETCH FEATURE ACTIONS

export const fetchFeatureData = data => ({
  type: FETCH_FEATURE_DATA.BASE,
  payload: {
    data,
  },
});

export const fetchFeatureDataBegin = () => ({
  type: FETCH_FEATURE_DATA.BEGIN,
});

export const fetchFeatureDataSuccess = data => ({
  type: FETCH_FEATURE_DATA.SUCCESS,
  payload: {
    data,
  },
});

export const fetchFeatureDataFailure = error => ({
  type: FETCH_FEATURE_DATA.FAILURE,
  payload: { error },
});

export const fetchFeatureDataReset = () => ({
  type: FETCH_FEATURE_DATA.RESET,
});
