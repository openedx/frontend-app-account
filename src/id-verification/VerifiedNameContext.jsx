import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import { getVerifiedNameHistory } from '../account-settings/data/service';
import { getMostRecentApprovedOrPendingVerifiedName } from '../utils';
import { useAsyncCall } from '../hooks';
import { SUCCESS_STATUS } from '../constants';

export const VerifiedNameContext = createContext();

export function VerifiedNameContextProvider({ children }) {
  const verifiedNameHistoryData = useAsyncCall(getVerifiedNameHistory);

  let verifiedNameEnabled = false;
  let verifiedName = '';
  const { status, data } = verifiedNameHistoryData;
  if (status === SUCCESS_STATUS && data) {
    const { verified_name_enabled: verifiedNameFeatureEnabled, results } = data;
    verifiedNameEnabled = verifiedNameFeatureEnabled;

    if (verifiedNameFeatureEnabled) {
      const applicableVerifiedName = getMostRecentApprovedOrPendingVerifiedName(results);
      verifiedName = applicableVerifiedName;
    }
  }

  const value = {
    verifiedNameHistoryCallStatus: status,
    verifiedNameEnabled,
    verifiedName,
  };

  return (<VerifiedNameContext.Provider value={value}>{children}</VerifiedNameContext.Provider>);
}

VerifiedNameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
