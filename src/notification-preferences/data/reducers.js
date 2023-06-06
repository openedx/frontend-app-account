import { Actions } from './actions';
import {
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
  FAILURE_STATUS,
} from '../../constants';

export const defaultState = {
  courses: {
    status: IDLE_STATUS,
    courses: [],
  },
  preferences: {
    status: IDLE_STATUS,
    selectedCourse: null,
    preferences: [],
    apps: [],
    notEditable: {},
  },
};

const notificationPreferencesReducer = (state = defaultState, action = {}) => {
  const {
    courseId, appId, notificationChannel, preferenceName, value,
  } = action;
  switch (action.type) {
    case Actions.FETCHING_COURSE_LIST:
      return {
        ...state,
        courses: {
          status: LOADING_STATUS,
          courses: [],
        },
      };
    case Actions.FETCHED_COURSE_LIST:
      return {
        ...state,
        courses: {
          status: SUCCESS_STATUS,
          courses: action.payload,
        },
      };
    case Actions.FAILED_COURSE_LIST:
      return {
        ...state,
        courses: {
          status: FAILURE_STATUS,
          courses: [],
        },
      };
    case Actions.FETCHING_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          status: LOADING_STATUS,
          preferences: [],
          apps: [],
          notEditable: {},
        },
      };
    case Actions.FETCHED_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          status: SUCCESS_STATUS,
          ...action.payload,
        },
      };
    case Actions.FAILED_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          status: FAILURE_STATUS,
          preferences: [],
          apps: [],
          notEditable: {},
        },
      };
    case Actions.UPDATE_SELECTED_COURSE:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          selectedCourse: courseId,
        },
      };
    case Actions.UPDATE_PREFERENCE:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          preferences: state.preferences.preferences.map((preference) => (
            preference.id === preferenceName
              ? { ...preference, [notificationChannel]: value }
              : preference
          )),
        },
      };
    case Actions.UPDATE_APP_PREFERENCE:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          apps: state.preferences.apps.map(app => (
            app.id === appId
              ? { ...app, enabled: value }
              : app
          )),
        },
      };
    default:
      return state;
  }
};

export default notificationPreferencesReducer;
