import {
  FETCH_SETTINGS,
  OPEN_FORM,
  CLOSE_FORM,
  SAVE_SETTINGS,
  RESET_PASSWORD,
  UPDATE_DRAFT,
  RESET_DRAFTS,
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
  resetPasswordState: null,
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

    default:
      return state;
  }
};

export default accountSettingsReducer;
