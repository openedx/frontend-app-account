import {
  FETCH_ACCOUNT,
  OPEN_FORM,
  CLOSE_FORM,
  SAVE_ACCOUNT,
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
  drafts: {},
  saveState: null,
};

const example = (state = defaultState, action) => {
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
      // Only close if the field to close is undefined or matches the field that is currently open
      if (action.payload.formId === state.openFormId) {
        return {
          ...state,
          openFormId: null,
          errors: {},
        };
      }
      return state;
    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: Object.assign({}, state.drafts, {
          [action.payload.name]: action.payload.value,
        }),
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

    default:
      return state;
  }
};

export default example;
