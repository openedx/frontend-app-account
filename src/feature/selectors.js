export const storeName = 'feature';

// Pass everything in state as props for now
export const featureSelector = state => ({ ...state[storeName] });
