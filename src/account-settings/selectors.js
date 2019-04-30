import { createSelector, createStructuredSelector } from 'reselect';

export const storeName = 'account-settings';

export const usernameSelector = state => state.authentication.username;

export const accountSettingsSelector = state => ({ ...state[storeName] });

const editableFieldNameSelector = (state, props) => props.name;

const valuesSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.values,
);

const draftsSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.drafts,
);

const editableFieldValueSelector = createSelector(
  editableFieldNameSelector,
  valuesSelector,
  draftsSelector,
  (name, values, drafts) => (drafts[name] !== undefined ? drafts[name] : values[name]),
);

const editableFieldErrorSelector = createSelector(
  editableFieldNameSelector,
  accountSettingsSelector,
  (name, accountSettings) => accountSettings.errors[name],
);

const editableFieldConfirmationValuesSelector = createSelector(
  editableFieldNameSelector,
  accountSettingsSelector,
  (name, accountSettings) => accountSettings.confirmationValues[name],
);

const isEditingSelector = createSelector(
  editableFieldNameSelector,
  accountSettingsSelector,
  (name, accountSettings) => accountSettings.openFormId === name,
);

const saveStateSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.saveState,
);

export const editableFieldSelector = createStructuredSelector({
  value: editableFieldValueSelector,
  error: editableFieldErrorSelector,
  confirmationValue: editableFieldConfirmationValuesSelector,
  saveState: saveStateSelector,
  isEditing: isEditingSelector,
});

export const resetPasswordSelector = createSelector(
  accountSettingsSelector,
  accountSettings => ({
    resetPasswordState: accountSettings.resetPasswordState,
    email: accountSettings.values.email,
  }),
);

export const thirdPartyAuthSelector = createSelector(
  accountSettingsSelector,
  accountSettings => ({
    providers: accountSettings.authProviders,
    loading: accountSettings.thirdPartyAuthLoading,
    loaded: accountSettings.thirdPartyAuthLoaded,
    loadingError: accountSettings.thirdPartyAuthLoadingError,
  }),
);
