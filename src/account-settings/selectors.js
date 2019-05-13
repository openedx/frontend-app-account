import { createSelector, createStructuredSelector } from 'reselect';
import {
  localeSelector,
  getAssumedServerLanguageCode,
  getCountryList,
  getLanguageList,
} from '@edx/frontend-i18n'; // eslint-disable-line

import { siteLanguageOptionsSelector } from '../site-language';

export const storeName = 'accountSettings';

export const usernameSelector = state => state.authentication.username;

export const userRolesSelector = state => state.authentication.roles || [];

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
    disconnectErrors: accountSettings.disconnectErrors,
    disconnectingState: accountSettings.disconnectingState,
  }),
);

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
      formValues[name] = chooseFormValue(drafts[name], value);
    });
    return formValues;
  },
);

const countryOptionsSelector = createSelector(
  localeSelector,
  locale => getCountryList(locale).map(({ code, name }) => ({ value: code, label: name })),
);

const languageProficiencyOptionsSelector = createSelector(
  localeSelector,
  locale => getLanguageList(locale).map(({ code, name }) => ({ value: code, label: name })),
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


/**
 * This selector converts the site language code back to the server version so that it can match up
 * with one of the options in the site language dropdown.  The drafts version will already be the
 * server version, but if it's from localeSelector, it will be our client (two character) version.
 */
const siteLanguageSelector = createSelector(
  draftsSelector,
  localeSelector,
  (drafts, locale) => (drafts.siteLanguage !== undefined ?
    drafts.siteLanguage : getAssumedServerLanguageCode(locale)),
);

export const accountSettingsPageSelector = createSelector(
  accountSettingsSelector,
  siteLanguageOptionsSelector,
  countryOptionsSelector,
  languageProficiencyOptionsSelector,
  formValuesSelector,
  siteLanguageSelector,
  profileDataManagerSelector,
  staticFieldsSelector,
  timeZonesSelector,
  countryTimeZonesSelector,
  (
    accountSettings,
    siteLanguageOptions,
    countryOptions,
    languageProficiencyOptions,
    formValues,
    siteLanguage,
    profileDataManager,
    staticFields,
    timeZoneOptions,
    countryTimeZoneOptions,
  ) => ({
    siteLanguageOptions,
    countryOptions,
    languageProficiencyOptions,
    siteLanguage,
    loading: accountSettings.loading,
    loaded: accountSettings.loaded,
    loadingError: accountSettings.loadingError,
    timeZoneOptions,
    countryTimeZoneOptions,
    formValues,
    profileDataManager,
    staticFields,
  }),
);
