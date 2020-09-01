export const logistrationSelector = state => state.registration;
export const forgotPasswordSelector = state => logistrationSelector(state).forgotPassword;
