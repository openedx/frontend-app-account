import { createSelector, createStructuredSelector } from 'reselect';

import { siteLanguageOptionsSelector, siteLanguageListSelector } from '../site-language';

export const storeName = 'accountSettings';

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

const previousSiteLanguageSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.previousSiteLanguage,
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

const confirmationValuesSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.confirmationValues,
);

const errorSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.errors,
);

const saveStateSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.saveState,
);

export const editableFieldSelector = createStructuredSelector({
  error: editableFieldErrorSelector,
  confirmationValue: editableFieldConfirmationValuesSelector,
  saveState: saveStateSelector,
  isEditing: isEditingSelector,
});

export const profileDataManagerSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.profileDataManager,
);

export const staticFieldsSelector = createSelector(
  accountSettingsSelector,
  accountSettings => (accountSettings.profileDataManager ? ['name', 'email', 'country'] : []),
);


/**
 * If there's no draft present at all (undefined), use the original committed value.
 */
function chooseFormValue(draft, committed) {
  return draft !== undefined ? draft : committed;
}

const formValuesSelector = createSelector(
  valuesSelector,
  draftsSelector,
  (values, drafts) => {
    const formValues = {};
    Object.entries(values).forEach(([name, value]) => {
      formValues[name] = chooseFormValue(drafts[name], value) || '';
    });
    return formValues;
  },
);

const transformTimeZonesToOptions = timeZoneArr => timeZoneArr
  .map(({ time_zone, description }) => ({ // eslint-disable-line camelcase
    value: time_zone, label: description,
  }));

const timeZonesSelector = createSelector(
  accountSettingsSelector,
  accountSettings => transformTimeZonesToOptions(accountSettings.timeZones),
);

const countryTimeZonesSelector = createSelector(
  accountSettingsSelector,
  accountSettings => transformTimeZonesToOptions(accountSettings.countryTimeZones),
);

const activeAccountSelector = createSelector(
  accountSettingsSelector,
  accountSettings => accountSettings.values.is_active,
);

export const siteLanguageSelector = createSelector(
  previousSiteLanguageSelector,
  draftsSelector,
  (previousValue, drafts) => ({
    previousValue,
    draft: drafts.siteLanguage,
  }),
);

export const betaLanguageBannerSelector = createStructuredSelector({
  siteLanguageList: siteLanguageListSelector,
  siteLanguage: siteLanguageSelector,
});

export const accountSettingsPageSelector = createSelector(
  accountSettingsSelector,
  siteLanguageOptionsSelector,
  siteLanguageSelector,
  formValuesSelector,
  profileDataManagerSelector,
  staticFieldsSelector,
  timeZonesSelector,
  countryTimeZonesSelector,
  activeAccountSelector,
  (
    accountSettings,
    siteLanguageOptions,
    siteLanguage,
    formValues,
    profileDataManager,
    staticFields,
    timeZoneOptions,
    countryTimeZoneOptions,
    activeAccount,
  ) => ({
    siteLanguageOptions,
    siteLanguage,
    loading: accountSettings.loading,
    loaded: accountSettings.loaded,
    loadingError: accountSettings.loadingError,
    timeZoneOptions,
    countryTimeZoneOptions,
    isActive: activeAccount,
    formValues,
    profileDataManager,
    staticFields,
    tpaProviders: accountSettings.thirdPartyAuth.providers,
  }),
);

export const coachingConsentPageSelector = createSelector(
  accountSettingsSelector,
  formValuesSelector,
  activeAccountSelector,
  saveStateSelector,
  confirmationValuesSelector,
  errorSelector,
  (
    accountSettings,
    formValues,
    activeAccount,
    saveState,
    confirmationValues,
    errors,
  ) => ({
    loading: accountSettings.loading,
    loaded: accountSettings.loaded,
    loadingError: accountSettings.loadingError,
    isActive: activeAccount,
    formValues,
    saveState,
    confirmationValues,
    formErrors: errors,
  }),
);
