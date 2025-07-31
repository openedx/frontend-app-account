import { Actions } from './actions';
import {
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
  FAILURE_STATUS,
} from '../../constants';
import { normalizeAccountPreferences } from './thunks';

export const defaultState = {
  showPreferences: false,
  preferences: {
    status: IDLE_STATUS,
    updatePreferenceStatus: IDLE_STATUS,
    preferences: [],
    apps: [],
    nonEditable: {},
  },
};

const notificationPreferencesReducer = (state = defaultState, action = {}) => {
  const {
    appId, notificationChannel, preferenceName, value,
  } = action;
  switch (action.type) {
    case Actions.FETCHING_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          status: LOADING_STATUS,
          preferences: [],
          apps: [],
          nonEditable: {},
        },
      };
    case Actions.FETCHED_PREFERENCES:
    {
      const { preferences } = state;
      if (action.isPreferenceUpdate) {
        normalizeAccountPreferences(preferences, action.payload);
      }

      return {
        ...state,
        preferences: {
          ...preferences,
          status: SUCCESS_STATUS,
          updatePreferenceStatus: SUCCESS_STATUS,
          ...action.payload,
        },
        showPreferences: action.showPreferences,
      };
    }
    case Actions.FAILED_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          status: FAILURE_STATUS,
          updatePreferenceStatus: FAILURE_STATUS,
          preferences: [],
          apps: [],
          nonEditable: {},
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
          updatePreferenceStatus: LOADING_STATUS,
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
          updatePreferenceStatus: LOADING_STATUS,
        },
      };
    default:
      return state;
  }
};

export default notificationPreferencesReducer;
