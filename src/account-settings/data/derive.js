import { compareVerifiedNamesByCreatedDate } from '../../utils';

/**
 * Pure derivations over the fetched account data and the form state. Everything the page needs
 * that is not a straight copy of an API response lives here, so it can be tested without React.
 */

export const sortVerifiedNameHistory = (verifiedNameHistory) => {
  const history = verifiedNameHistory?.results;

  if (Array.isArray(history)) {
    return [...history].sort(compareVerifiedNamesByCreatedDate);
  }

  return [];
};

export const getMostRecentVerifiedName = (sortedHistory) => (
  sortedHistory.length > 0 ? sortedHistory[0] : null
);

/**
 * The verified name to show as the learner's current one: the latest approved name, unless a
 * newer name is still under review, in which case that one.
 */
export const getMostRecentApprovedVerifiedName = (sortedHistory) => {
  const mostRecentVerifiedName = getMostRecentVerifiedName(sortedHistory);
  const approvedVerifiedNames = sortedHistory.filter(name => name.status === 'approved');
  const approvedVerifiedName = approvedVerifiedNames.length > 0 ? approvedVerifiedNames[0] : null;

  switch (mostRecentVerifiedName && mostRecentVerifiedName.status) {
    case 'approved':
    case 'denied':
    case 'pending':
      return approvedVerifiedName;
    case 'submitted':
      return mostRecentVerifiedName;
    default:
      return null;
  }
};

/**
 * The committed values as the form sees them: the fetched account and preferences plus the
 * verified name fields, with a pending certificate-name choice taking precedence.
 */
export const getCommittedValues = ({
  values,
  verifiedNameHistory,
  confirmationValues,
  approvedVerifiedName,
}) => {
  let useVerifiedNameForCerts = verifiedNameHistory?.use_verified_name_for_certs || false;

  if (Object.keys(confirmationValues).includes('useVerifiedNameForCerts')) {
    useVerifiedNameForCerts = confirmationValues.useVerifiedNameForCerts;
  }

  return {
    ...values,
    verified_name: approvedVerifiedName?.verified_name,
    useVerifiedNameForCerts,
  };
};

/**
 * If there's no draft present at all (undefined), use the original committed value.
 */
const chooseFormValue = (draft, committed) => (draft !== undefined ? draft : committed);

export const getFormValues = (committedValues, drafts) => {
  const formValues = {};

  Object.entries(committedValues).forEach(([name, value]) => {
    if (typeof value === 'boolean') {
      formValues[name] = chooseFormValue(drafts[name], value);
    } else if (typeof value === 'object' && name === 'extended_profile' && value !== null) {
      const extendedProfile = value.slice();
      const draftsKeys = Object.keys(drafts);

      if (draftsKeys.length !== 0) {
        const draftFieldName = draftsKeys[0];
        const index = extendedProfile.findIndex((profile) => profile.field_name === draftFieldName);

        if (index !== -1) {
          extendedProfile[index] = { field_name: draftFieldName, field_value: drafts[draftFieldName] };
        }
      }

      formValues.extended_profile = [...extendedProfile];
    } else {
      formValues[name] = chooseFormValue(drafts[name], value) || '';
    }
  });

  return formValues;
};

export const getStaticFields = (profileDataManager, mostRecentVerifiedName) => {
  const staticFields = [];

  if (profileDataManager) {
    staticFields.push('name', 'email', 'country');
  }
  if (mostRecentVerifiedName && ['submitted'].includes(mostRecentVerifiedName.status)) {
    staticFields.push('verifiedName');
  }

  return staticFields;
};

export const transformTimeZonesToOptions = (timeZones) => timeZones
  .map(({ time_zone, description }) => ({ // eslint-disable-line camelcase
    value: time_zone, label: description, // eslint-disable-line camelcase
  }));

export const getSiteLanguageOptions = (siteLanguageList) => siteLanguageList.map(({ code, name }) => ({
  value: code,
  label: name,
}));
