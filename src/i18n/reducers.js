import { getLocale } from './i18n-loader';
import { SET_LOCALE } from './actions';

const defaultState = {
  locale: getLocale(),
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return {
        locale: action.payload.locale,
      };
    default:
      return state;
  }
};

export default reducer;
