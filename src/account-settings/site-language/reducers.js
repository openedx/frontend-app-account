import { FETCH_SITE_LANGUAGES } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguageList: [],
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case FETCH_SITE_LANGUAGES.BEGIN:
        return {
          ...state,
          loading: true,
          loaded: false,
          loadingError: null,
        };
      case FETCH_SITE_LANGUAGES.SUCCESS:
        return {
          ...state,
          siteLanguageList: action.payload.siteLanguageList,
          loading: false,
          loaded: true,
          loadingError: null,
        };
      case FETCH_SITE_LANGUAGES.FAILURE:
        return {
          ...state,
          loading: false,
          loaded: false,
          loadingError: action.payload.error,
        };
      case FETCH_SITE_LANGUAGES.RESET:
        return {
          ...state,
          loading: false,
          loaded: false,
          loadingError: null,
        };
      default:
    }
  }
  return state;
};

export default reducer;
