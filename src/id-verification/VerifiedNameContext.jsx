import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useVerifiedNameHistory } from '@src/account-settings/data/hooks';
import { getMostRecentApprovedOrPendingVerifiedName } from '@src/utils';
import { FAILURE_STATUS, LOADING_STATUS, SUCCESS_STATUS } from '@src/constants';

export const VerifiedNameContext = createContext();

// The history request never rejects: it resolves to an empty object when it fails.
const getCallStatus = ({ isPending, data }) => {
  if (isPending) {
    return LOADING_STATUS;
  }
  return data && Object.keys(data).length > 0 ? SUCCESS_STATUS : FAILURE_STATUS;
};

export const VerifiedNameContextProvider = ({ children }) => {
  const verifiedNameHistory = useVerifiedNameHistory();
  const status = getCallStatus(verifiedNameHistory);

  let verifiedName = '';
  if (status === SUCCESS_STATUS && verifiedNameHistory.data.results) {
    verifiedName = getMostRecentApprovedOrPendingVerifiedName(verifiedNameHistory.data.results);
  }

  const value = useMemo(() => ({
    verifiedNameHistoryCallStatus: status,
    verifiedName,
  }), [status, verifiedName]);

  return (<VerifiedNameContext.Provider value={value}>{children}</VerifiedNameContext.Provider>);
};

VerifiedNameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
