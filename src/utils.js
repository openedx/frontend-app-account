import { getSiteConfig, resolveRouteByRole } from '@openedx/frontend-base';

import { dashboardRole, logoutRole } from '@src/constants';

/**
 * Compare two dates.
 * @param {*} a the first date
 * @param {*} b the second date
 * @returns a negative integer if a > b, a positive integer if a < b, or 0 if a = b
 */
export function compareVerifiedNamesByCreatedDate(a, b) {
  const aTimeSinceEpoch = new Date(a.created).getTime();
  const bTimeSinceEpoch = new Date(b.created).getTime();
  return bTimeSinceEpoch - aTimeSinceEpoch;
}

/**
 *
 * @param {*} verifiedNames a list of verified name objects, where each object has at least the
 *                          following keys: created, status, and verified_name.
 * @returns the most recent verified name object from the list parameter with the 'pending' or
 *          'accepted' status, if one exists; otherwise, null
 */
export function getMostRecentApprovedOrPendingVerifiedName(verifiedNames) {
  // clone array so as not to modify original array
  const names = [...verifiedNames];

  if (Array.isArray(names)) {
    names.sort(compareVerifiedNamesByCreatedDate);
  }

  // We only want to consider a subset of verified names when determining the value of nameOnAccount.
  // approved: consider this status, as the name has been verified by IDV and should supersede the full name
  //           (profile name).
  // pending: consider this status, as the learner has started the name change process through the
  //          Account Settings page, and has been navigated to IDV to complete the name change process.
  // submitted: do not consider this status, as the name has already been submitted for verification through
  //            IDV but has not yet been verified
  // denied: do not consider this status because the name was already denied via the IDV process
  const applicableNames = names.filter(name => ['approved', 'pending'].includes(name.status));
  const applicableName = applicableNames.length > 0 ? applicableNames[0].verified_name : null;

  return applicableName;
}

/**
 * Parse an environment variable string value to a boolean.
 * @param {string} value the environment variable string value
 * @returns {boolean} the parsed boolean value
 */
export const parseEnvBoolean = (value) => {
  if (!value) {
    return false;
  }
  return String(value).toLowerCase() === 'true';
};

/**
 * Parse a configuration value that is a list, whether it arrived as an array or as a JSON string.
 * @param {string|Array} value the configuration value
 * @returns {Array} the list, or an empty list if the value is unset or unparseable
 */
export const parseEnvArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== 'string' || value === '') {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

/**
 * The URL of the learner dashboard: the route the site provides for the dashboard role, or the
 * LMS's own dashboard when it provides none.
 * @returns {string}
 */
export const getDashboardUrl = () => (
  resolveRouteByRole(dashboardRole)?.url ?? `${getSiteConfig().lmsBaseUrl}/dashboard`
);

/**
 * The URL that logs the learner out: the route the site provides for the logout role, or the
 * configured `logoutUrl` when it provides none.
 * @returns {string}
 */
export const getLogoutUrl = () => resolveRouteByRole(logoutRole)?.url ?? getSiteConfig().logoutUrl;
