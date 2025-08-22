import { compareVerifiedNamesByCreatedDate } from '../../utils';

const chooseFormValue = (draft, committed) => {
  return draft !== undefined ? draft : committed;
};

const transformFormValues = (values: Record<string, any>, drafts: Record<string, any>) => {
  const formValues: Record<string, any> = {};
  Object.entries(values).forEach(([name, value]) => {
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
      formValues[name] = chooseFormValue(drafts[name], value) ?? '';
    }
  });
  return formValues;
};

const getMostRecentVerifiedName = (verifiedNameHistory) => {
  const sortedHistory = sortVerifiedNameHistory(verifiedNameHistory);
  return sortedHistory.length > 0 ? sortedHistory[0] : null;
};

const getMostRecentApprovedVerifiedNameValue = (verifiedNameHistory) => {
  // Sort by created date (most recent first)
  const sortedHistory = sortVerifiedNameHistory(verifiedNameHistory);
  const mostRecentVerifiedName = sortedHistory.length > 0 ? sortedHistory[0] : null;

  // Filter approved verified names
  const approvedVerifiedNames = sortedHistory.filter(name => name.status === 'approved');
  const approvedVerifiedName = approvedVerifiedNames.length > 0 ? approvedVerifiedNames[0] : null;

  // Determine which verified name to return based on most recent status
  let verifiedName = null;
  switch (mostRecentVerifiedName?.status) {
    case 'approved':
    case 'denied':
    case 'pending':
      verifiedName = approvedVerifiedName;
      break;
    case 'submitted':
      verifiedName = mostRecentVerifiedName;
      break;
    default:
      verifiedName = null;
  }

  return verifiedName;
};

const getCommitedValues = (accountSettings, confirmationValues, verifiedNameHistory) => {
  const mostRecentApprovedVerifiedNameValue: any = getMostRecentApprovedVerifiedNameValue(verifiedNameHistory);
  let useVerifiedNameForCerts = (
    verifiedNameHistory?.use_verified_name_for_certs ?? false
  );

  if (Object.keys(confirmationValues).includes('useVerifiedNameForCerts')) {
    useVerifiedNameForCerts = confirmationValues.useVerifiedNameForCerts;
  }

  return {
    name: accountSettings.name ?? '',
    country: accountSettings.country ?? '',
    verified_name: mostRecentApprovedVerifiedNameValue?.verified_name,
    useVerifiedNameForCerts,
  };
};

const sortVerifiedNameHistory = history => {
  if (Array.isArray(history)) {
    return history.sort(compareVerifiedNamesByCreatedDate);
  }

  return [];
};

export { getCommitedValues, transformFormValues, sortVerifiedNameHistory, getMostRecentVerifiedName, getMostRecentApprovedVerifiedNameValue };
