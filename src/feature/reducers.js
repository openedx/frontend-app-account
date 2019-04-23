import { FETCH_FEATURE_DATA } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  data: null,
};

const feature = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_FEATURE_DATA.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    case FETCH_FEATURE_DATA.SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        loading: false,
        loaded: true,
        loadingError: null,
      };
    case FETCH_FEATURE_DATA.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FETCH_FEATURE_DATA.RESET:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: null,
      };
    default:
      return state;
  }
};

export default feature;
