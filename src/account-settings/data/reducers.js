import {
  BEGIN_NAME_CHANGE,
  CLOSE_FORM,
  FETCH_SETTINGS,
  FETCH_TIME_ZONES,
  OPEN_FORM,
  RESET_DRAFTS,
  SAVE_MULTIPLE_SETTINGS,
  SAVE_PREVIOUS_SITE_LANGUAGE,
  SAVE_SETTINGS,
  UPDATE_DRAFT,
} from './actions';

import { FETCH_SITE_LANGUAGES, reducer as siteLanguageReducer } from '../site-language';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  data: null,
  values: {},
  errors: {},
  confirmationValues: {},
  drafts: {},
  saveState: null,
  timeZones: [],
  countryTimeZones: [],
  previousSiteLanguage: null,
  // deleteAccount: deleteAccountReducer(),
  siteLanguage: siteLanguageReducer(),
  // nameChange: nameChangeReducer(),
  nameChangeModal: false,
  verifiedName: null,
  mostRecentVerifiedName: {},
  verifiedNameHistory: {},
  countriesCodesList: [],
};

const reducer = (state = defaultState, action = {}) => {
  let dispatcherIsOpenForm;

  switch (action.type) {
    case FETCH_SETTINGS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    case FETCH_SETTINGS.SUCCESS:
      return {
        ...state,
        values: { ...state.values, ...action.payload.values },
        profileDataManager: action.payload.profileDataManager,
        timeZones: action.payload.timeZones,
        loading: false,
        loaded: true,
        loadingError: null,
        verifiedNameHistory: action.payload.verifiedNameHistory,
        countriesCodesList: action.payload.countriesCodesList,
      };
    case FETCH_SETTINGS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FETCH_SETTINGS.RESET:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: null,
      };

    case OPEN_FORM:
      return {
        ...state,
        openFormId: action.payload.formId,
        saveState: null,
        errors: {},
        drafts: {},
      };
    case CLOSE_FORM:
      dispatcherIsOpenForm = action.payload.formId === state.openFormId;
      if (dispatcherIsOpenForm) {
        return {
          ...state,
          openFormId: null,
          saveState: null,
          errors: {},
          drafts: {},
          nameChangeModal: false,
        };
      }
      return state;
    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: { ...state.drafts, [action.payload.name]: action.payload.value },
        saveState: null,
        errors: {},
      };

    case RESET_DRAFTS:
      return {
        ...state,
        drafts: {},
      };

    case BEGIN_NAME_CHANGE:
      return {
        ...state,
        saveState: 'error',
        nameChangeModal: {
          formId: action.payload.formId,
        },
      };

    case SAVE_SETTINGS.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        errors: {},
      };
    case SAVE_SETTINGS.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        values: { ...state.values, ...action.payload.values },
        errors: {},
        confirmationValues: {
          ...state.confirmationValues,
          ...action.payload.confirmationValues,
        },
      };
    case SAVE_SETTINGS.FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: { ...state.errors, ...action.payload.errors },
      };
    case SAVE_SETTINGS.RESET:
      return {
        ...state,
        saveState: null,
        errors: {},
      };
    case SAVE_PREVIOUS_SITE_LANGUAGE:
      return {
        ...state,
        previousSiteLanguage: action.payload.previousSiteLanguage,
      };
    case SAVE_MULTIPLE_SETTINGS.BEGIN:
      return {
        ...state,
        saveState: 'pending',
      };

    case SAVE_MULTIPLE_SETTINGS.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
      };

    case SAVE_MULTIPLE_SETTINGS.FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: { ...state.errors, ...action.payload.errors },
      };

    case FETCH_TIME_ZONES.SUCCESS:
      return {
        ...state,
        countryTimeZones: action.payload.timeZones,
      };

      // TODO: Once all the above cases have been converted into sub-reducers, we can use
      // combineReducers in this file to greatly simplify it.

      // Delete My Account
    /* case DELETE_ACCOUNT.CONFIRMATION:
    case DELETE_ACCOUNT.BEGIN:
    case DELETE_ACCOUNT.SUCCESS:
    case DELETE_ACCOUNT.FAILURE:
    case DELETE_ACCOUNT.RESET:
    case DELETE_ACCOUNT.CANCEL:
      return {
        ...state,
        deleteAccount: deleteAccountReducer(state.deleteAccount, action),
      };
    */
    case FETCH_SITE_LANGUAGES.BEGIN:
    case FETCH_SITE_LANGUAGES.SUCCESS:
    case FETCH_SITE_LANGUAGES.FAILURE:
    case FETCH_SITE_LANGUAGES.RESET:
      return {
        ...state,
        siteLanguage: siteLanguageReducer(state.siteLanguage, action),
      };

    default:
      return state;
  }
};

export default reducer;
