import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getVerifiedNameHistory } from '../account-settings/data/service';
import { getMostRecentApprovedOrPendingVerifiedName } from '../utils';
import { useAsyncCall } from '../hooks';

export const VerifiedNameContext = createContext();

export function VerifiedNameContextProvider({ children }) {
  const [verifiedNameEnabled, setVerifiedNameEnabled] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [isVerifiedNameHistoryLoading, verifiedNameHistory] = useAsyncCall(getVerifiedNameHistory);

  useEffect(() => {
    if (verifiedNameHistory) {
      const { verified_name_enabled: verifiedNameFeatureEnabled, results } = verifiedNameHistory;
      setVerifiedNameEnabled(verifiedNameFeatureEnabled);

      if (verifiedNameFeatureEnabled) {
        const applicableVerifiedName = getMostRecentApprovedOrPendingVerifiedName(results);
        setVerifiedName(applicableVerifiedName);
      }
    }
  }, [verifiedNameHistory]);

  const value = {
    isVerifiedNameHistoryLoading,
    verifiedNameEnabled,
    verifiedName,
  };

  return (<VerifiedNameContext.Provider value={value}>{children}</VerifiedNameContext.Provider>);
}

VerifiedNameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
