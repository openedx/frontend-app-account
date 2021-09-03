import { createSelector, createStructuredSelector } from 'reselect';
import { siteLanguageListSelector, siteLanguageOptionsSelector } from '../site-language';

export const storeName = 'accountSettings';

export const accountSettingsSelector = state => ({ ...state[storeName] });

const editableFieldNameSelector = (state, props) => props.name;

const sortedVerifiedNameHistorySelector = createSelector(
  accountSettingsSelector,
  accountSettings => {
    function sortDates(a, b) {
      const aTimeSinceEpoch = new Date(a).getTime();
      const bTimeSinceEpoch = new Date(b).getTime();
      return bTimeSinceEpoch - aTimeSinceEpoch;
    }

    const history = accountSettings.values.verifiedNameHistory && accountSettings.values.verifiedNameHistory.results;

    if (Array.isArray(history)) {
      return history.sort(sortDates);
    }

    return [];
  },
);

const mostRecentVerifiedNameSelector = createSelector(
  sortedVerifiedNameHistorySelector,
  sortedHistory => (sortedHistory.length > 0 ? sortedHistory[0] : null),
);

const mostRecentApprovedVerifiedNameValueSelector = createSelector(
  sortedVerifiedNameHistorySelector,
  mostRecentVerifiedNameSelector,
  (sortedHistory, mostRecentVerifiedName) => {
    const approvedVerifiedNames = sortedHistory.filter(name => name.status === 'approved');
    const approvedVerifiedName = approvedVerifiedNames.length > 0 ? approvedVerifiedNames[0] : null;

    let verifiedName = null;
    switch (mostRecentVerifiedName && mostRecentVerifiedName.status) {
      case 'approved':
      case 'denied':
        verifiedName = approvedVerifiedName;
        break;
      case 'submitted':
        verifiedName = mostRecentVerifiedName;
        break;
      default:
        verifiedName = null;
    }
    return verifiedName;
  },
);

const valuesSelector = createSelector(
  accountSettingsSelector,
  mostRecentVerifiedNameSelector,
  mostRecentApprovedVerifiedNameValueSelector,
  (accountSettings, mostRecentVerifiedNameValue, mostRecentApprovedVerifiedNameValue) => (
    {
      ...accountSettings.values,
      verifiedName: mostRecentApprovedVerifiedNameValue,
      mostRecentVerifiedName: mostRecentVerifiedNameValue,
    }),
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
  mostRecentVerifiedNameSelector,
  (accountSettings, verifiedName) => {
    const staticFields = [];
    if (accountSettings.profileDataManager) {
      staticFields.push('name', 'email', 'country');
    }
    if (verifiedName && ['pending', 'submitted'].includes(verifiedName.status)) {
      staticFields.push('verifiedName');
    }

    return staticFields;
  },
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
  profileDataManagerSelector,
  saveStateSelector,
  confirmationValuesSelector,
  errorSelector,
  (
    accountSettings,
    formValues,
    activeAccount,
    profileDataManager,
    saveState,
    confirmationValues,
    errors,
  ) => ({
    loading: accountSettings.loading,
    loaded: accountSettings.loaded,
    loadingError: accountSettings.loadingError,
    isActive: activeAccount,
    profileDataManager,
    formValues,
    saveState,
    confirmationValues,
    formErrors: errors,
  }),
);

export const demographicsSectionSelector = createSelector(
  formValuesSelector,
  draftsSelector,
  errorSelector,
  (
    formValues,
    drafts,
    errors,
  ) => ({
    formValues,
    drafts,
    formErrors: errors,
  }),
);
