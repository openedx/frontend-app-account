import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_EXAMPLE_DATA = new AsyncActionType('EXAMPLE', 'FETCH_EXAMPLE_DATA');

// FETCH EXAMPLE ACTIONS

export const fetchExampleData = data => ({
  type: FETCH_EXAMPLE_DATA.BASE,
  payload: {
    data,
  },
});

export const fetchExampleDataBegin = () => ({
  type: FETCH_EXAMPLE_DATA.BEGIN,
});

export const fetchExampleDataSuccess = data => ({
  type: FETCH_EXAMPLE_DATA.SUCCESS,
  payload: {
    data,
  },
});

export const fetchExampleDataFailure = error => ({
  type: FETCH_EXAMPLE_DATA.FAILURE,
  payload: { error },
});

export const fetchExampleDataReset = () => ({
  type: FETCH_EXAMPLE_DATA.RESET,
});
