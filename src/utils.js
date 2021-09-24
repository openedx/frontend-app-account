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
