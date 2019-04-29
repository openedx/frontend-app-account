import {
  FETCH_ACCOUNT,
  OPEN_FORM,
  CLOSE_FORM,
  SAVE_ACCOUNT,
  RESET_PASSWORD,
  UPDATE_DRAFT,
  RESET_DRAFTS,
  FETCH_THIRD_PARTY_AUTH_PROVIDERS,
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
    case FETCH_ACCOUNT.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    case FETCH_ACCOUNT.SUCCESS:
      return {
        ...state,
        values: Object.assign({}, state.values, action.payload.values),
        loading: false,
        loaded: true,
        loadingError: null,
      };
    case FETCH_ACCOUNT.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FETCH_ACCOUNT.RESET:
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

    case SAVE_ACCOUNT.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        errors: {},
      };
    case SAVE_ACCOUNT.SUCCESS:
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
    case SAVE_ACCOUNT.FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: Object.assign({}, state.errors, action.payload.errors),
      };
    case SAVE_ACCOUNT.RESET:
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

    case FETCH_THIRD_PARTY_AUTH_PROVIDERS.BEGIN:
      return {
        ...state,
        thirdPartyAuthLoading: true,
        thirdPartyAuthLoaded: false,
        thirdPartyAuthLoadingError: null,
      };
    case FETCH_THIRD_PARTY_AUTH_PROVIDERS.SUCCESS:
      return {
        ...state,
        authProviders: action.payload.providers,
        thirdPartyAuthLoading: false,
        thirdPartyAuthLoaded: true,
        thirdPartyAuthLoadingError: null,
      };
    case FETCH_THIRD_PARTY_AUTH_PROVIDERS.FAILURE:
      return {
        ...state,
        thirdPartyAuthLoading: false,
        thirdPartyAuthLoaded: false,
        thirdPartyAuthLoadingError: action.payload.error,
      };
    case FETCH_THIRD_PARTY_AUTH_PROVIDERS.RESET:
      return {
        ...state,
        thirdPartyAuthLoading: false,
        thirdPartyAuthLoaded: false,
        thirdPartyAuthLoadingError: null,
      };

    default:
      return state;
  }
};

export default accountSettingsReducer;
