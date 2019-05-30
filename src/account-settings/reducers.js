import {
  FETCH_SETTINGS,
  OPEN_FORM,
  CLOSE_FORM,
  SAVE_SETTINGS,
  FETCH_TIME_ZONES,
  SAVE_PREVIOUS_SITE_LANGUAGE,
  RESET_PASSWORD,
  DISCONNECT_AUTH,
  UPDATE_DRAFT,
  RESET_DRAFTS,
  DELETE_ACCOUNT,
} from './actions';

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
  accountDeletionState: null,
  resetPasswordState: null,
  timeZones: [],
  countryTimeZones: [],
  disconnectingState: null,
  disconnectErrors: {},
  previousSiteLanguage: null,
};

const accountSettingsReducer = (state = defaultState, action) => {
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
        values: Object.assign({}, state.values, action.payload.values),
        authProviders: action.payload.thirdPartyAuthProviders,
        profileDataManager: action.payload.profileDataManager,
        timeZones: action.payload.timeZones,
        loading: false,
        loaded: true,
        loadingError: null,
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
        };
      }
      return state;
    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: Object.assign({}, state.drafts, {
          [action.payload.name]: action.payload.value,
        }),
        saveState: null,
        errors: {},
      };

    case RESET_DRAFTS:
      return {
        ...state,
        drafts: {},
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
        values: Object.assign({}, state.values, action.payload.values),
        errors: {},
        confirmationValues: Object.assign(
          {},
          state.confirmationValues,
          action.payload.confirmationValues,
        ),
      };
    case SAVE_SETTINGS.FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: Object.assign({}, state.errors, action.payload.errors),
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

    case DELETE_ACCOUNT.CONFIRMATION:
      return {
        ...state,
        accountDeletionState: 'confirming',
      };

    case DELETE_ACCOUNT.BEGIN:
      return {
        ...state,
        accountDeletionState: 'pending',
      };

    case DELETE_ACCOUNT.SUCCESS:
      return {
        ...state,
        accountDeletionState: 'deleted',
      };

    case DELETE_ACCOUNT.FAILURE:
      return {
        ...state,
        accountDeletionState: 'failed',
        deletionErrorType: action.payload.reason || 'server',
      };

    case DELETE_ACCOUNT.RESET: {
      const oldDeletionState = state.accountDeletionState;

      return {
        ...state,
        accountDeletionState: oldDeletionState === 'failed' ? 'confirming' : oldDeletionState,
        deletionErrorType: null,
      };
    }

    case DELETE_ACCOUNT.CANCEL:
      return {
        ...state,
        accountDeletionState: null,
        deletionErrorType: null,
      };

    case RESET_PASSWORD.BEGIN:
      return {
        ...state,
        resetPasswordState: 'pending',
      };
    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        resetPasswordState: 'complete',
      };

    case FETCH_TIME_ZONES.SUCCESS:
      return {
        ...state,
        countryTimeZones: action.payload.timeZones,
      };


    case DISCONNECT_AUTH.BEGIN:
      return {
        ...state,
        disconnectingState: 'pending',
      };
    case DISCONNECT_AUTH.SUCCESS:
      return {
        ...state,
        disconnectingState: 'complete',
        authProviders: action.payload.thirdPartyAuthProviders,
      };
    case DISCONNECT_AUTH.FAILURE:
      return {
        ...state,
        disconnectingState: 'error',
        disconnectErrors: {
          [action.payload.providerId]: true,
        },
      };
    case DISCONNECT_AUTH.RESET:
      return {
        ...state,
        disconnectingState: null,
        disconnectErrors: {},
      };

    default:
      return state;
  }
};

export default accountSettingsReducer;
