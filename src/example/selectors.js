export const storeName = 'example';

// Pass everything in state as props for now
export const exampleSelector = state => ({ ...state[storeName] });
