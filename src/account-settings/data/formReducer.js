/**
 * Client-side state of the settings form: which field is being edited, the unsaved drafts, the
 * outcome of the last save and the pending confirmations (a new email address waiting to be
 * confirmed, for instance). Server data lives in react-query; this is everything else that more
 * than one component needs to agree on.
 */

export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';
export const BEGIN_NAME_CHANGE = 'BEGIN_NAME_CHANGE';
export const SAVE_BEGIN = 'SAVE_BEGIN';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_FAILURE = 'SAVE_FAILURE';
export const SAVE_RESET = 'SAVE_RESET';
export const SAVE_PREVIOUS_SITE_LANGUAGE = 'SAVE_PREVIOUS_SITE_LANGUAGE';

export const initialFormState = {
  openFormId: null,
  drafts: {},
  errors: {},
  confirmationValues: {},
  saveState: null,
  nameChangeModal: false,
  previousSiteLanguage: null,
};

export const formReducer = (state = initialFormState, action = {}) => {
  switch (action.type) {
    case OPEN_FORM:
      return {
        ...state,
        openFormId: action.formId,
        saveState: null,
        errors: {},
        drafts: {},
      };

    case CLOSE_FORM:
      // Only the open form may close itself; a stale close from another field is ignored.
      if (action.formId !== state.openFormId) {
        return state;
      }
      return {
        ...state,
        openFormId: null,
        saveState: null,
        errors: {},
        drafts: {},
        nameChangeModal: false,
      };

    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: { ...state.drafts, [action.name]: action.value },
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
        nameChangeModal: { formId: action.formId },
      };

    case SAVE_BEGIN:
      return {
        ...state,
        saveState: 'pending',
        errors: {},
      };

    case SAVE_SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        errors: {},
        confirmationValues: {
          ...state.confirmationValues,
          ...action.confirmationValues,
        },
      };

    case SAVE_FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: { ...state.errors, ...action.errors },
      };

    case SAVE_RESET:
      return {
        ...state,
        saveState: null,
        errors: {},
      };

    case SAVE_PREVIOUS_SITE_LANGUAGE:
      return {
        ...state,
        previousSiteLanguage: action.previousSiteLanguage,
      };

    default:
      return state;
  }
};

export default formReducer;
