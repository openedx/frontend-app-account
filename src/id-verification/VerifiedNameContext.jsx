import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getVerifiedNameHistory } from '../account-settings/data/service';
import { getMostRecentApprovedOrPendingVerifiedName } from '../utils';

export const VerifiedNameContext = createContext();

export function VerifiedNameContextProvider({ children }) {
  const [verifiedNameEnabled, setVerifiedNameEnabled] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  useEffect(() => {
    // Make API call to retrieve VerifiedName history for the learner.
    // From this information, derive whether the verified name feature is enabled
    // and the learner's verified name as it should be displayed during the IDV process.
    (async () => {
      const response = await getVerifiedNameHistory();
      if (response) {
        const { verified_name_enabled: verifiedNameFeatureEnabled, results } = response;
        setVerifiedNameEnabled(verifiedNameFeatureEnabled);

        if (verifiedNameFeatureEnabled) {
          const applicableVerifiedName = getMostRecentApprovedOrPendingVerifiedName(results);
          setVerifiedName(applicableVerifiedName);
        }
      }
    })();
  }, []);

  const value = {
    verifiedNameEnabled,
    verifiedName,
  };

  return (<VerifiedNameContext.Provider value={value}>{children}</VerifiedNameContext.Provider>);
}

VerifiedNameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
