export const storeName = 'account-settings';


export const pageSelector = state => ({ ...state[storeName] });

export const formSelector = (state, props) => {
  const value = state[storeName].drafts[props.name] !== undefined ?
    state[storeName].drafts[props.name] :
    state[storeName].values[props.name];

  return {
    value,
    error: state[storeName].errors[props.name],
  };
};
