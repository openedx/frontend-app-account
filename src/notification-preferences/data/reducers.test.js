// eslint-disable-next-line import/no-named-default
import { default as reducer } from './reducers';
import { Actions } from './actions';
import {
  FAILURE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
  IDLE_STATUS,
} from '../../constants';

describe('notification-preferences reducer', () => {
  let state = null;

  const preferenceData = {
    apps: [{ id: 'discussion', enabled: true }],
    preferences: [{
      id: 'newPost',
      appId: 'discussion',
      web: false,
      push: false,
      mobile: false,
    }],
    nonEditable: {},
  };

  beforeEach(() => {
    state = reducer();
  });

  it('updates preferences when api call is successful', () => {
    const result = reducer(
      state,
      { type: Actions.FETCHED_PREFERENCES, payload: preferenceData },
    );
    expect(result.preferences).toEqual({
      status: SUCCESS_STATUS,
      updatePreferenceStatus: SUCCESS_STATUS,
      ...preferenceData,
    });
  });

  test.each([
    { action: Actions.FETCHING_PREFERENCES, status: LOADING_STATUS, updatePreferenceStatus: IDLE_STATUS },
    { action: Actions.FAILED_PREFERENCES, status: FAILURE_STATUS, updatePreferenceStatus: FAILURE_STATUS },
  ])('preferences are empty when api call is %s', ({ action, status, updatePreferenceStatus }) => {
    const result = reducer(
      state,
      { type: action },
    );
    expect(result.preferences).toEqual({
      status,
      preferences: [],
      apps: [],
      nonEditable: {},
      updatePreferenceStatus,
    });
  });

  it('app preference changes when action is dispatched', () => {
    state = reducer(
      state,
      { type: Actions.FETCHED_PREFERENCES, payload: preferenceData },
    );
    const result = reducer(
      state,
      {
        type: Actions.UPDATE_APP_PREFERENCE,
        appId: 'discussion',
        value: false,
      },
    );
    expect(result.preferences.apps[0].enabled).toBeFalsy();
  });

  it('preference changes when action is dispatched', () => {
    state = reducer(
      state,
      { type: Actions.FETCHED_PREFERENCES, payload: preferenceData },
    );
    const result = reducer(
      state,
      {
        type: Actions.UPDATE_PREFERENCE,
        appId: 'discussion',
        preferenceName: 'newPost',
        notificationChannel: 'web',
        value: true,
      },
    );
    expect(result.preferences.preferences[0].web).toBeTruthy();
  });
});
