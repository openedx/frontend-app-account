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
  const selectedCourseId = 'selected-course-id';

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

  it('updates course list when api call is successful', () => {
    const data = {
      pagination: {
        count: 1,
        currentPage: 1,
        hasMore: false,
        totalPages: 1,
      },
      courseList: [
        { id: selectedCourseId, name: 'Selected Course' },
      ],
    };
    const result = reducer(
      state,
      { type: Actions.FETCHED_COURSE_LIST, payload: data },
    );
    expect(result.courses).toEqual({
      status: SUCCESS_STATUS,
      courses: data.courseList,
      pagination: data.pagination,
    });
  });

  test.each([
    { action: Actions.FETCHING_COURSE_LIST, status: LOADING_STATUS },
    { action: Actions.FAILED_COURSE_LIST, status: FAILURE_STATUS },
  ])('course list is empty when api call is %s', ({ action, status }) => {
    const result = reducer(
      state,
      { type: action },
    );
    expect(result.courses).toEqual({
      status,
      courses: [],
      pagination: {},
    });
  });

  it('updates selected course id', () => {
    const result = reducer(
      state,
      { type: Actions.UPDATE_SELECTED_COURSE, courseId: selectedCourseId },
    );
    expect(result.preferences.selectedCourse).toEqual(selectedCourseId);
  });

  it('updates preferences when api call is successful', () => {
    const result = reducer(
      state,
      { type: Actions.FETCHED_PREFERENCES, payload: preferenceData },
    );
    expect(result.preferences).toEqual({
      status: SUCCESS_STATUS,
      updatePreferenceStatus: SUCCESS_STATUS,
      selectedCourse: null,
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
      selectedCourse: null,
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
