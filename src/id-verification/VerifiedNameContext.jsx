import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getVerifiedNameHistory } from '../account-settings/data/service';
import { getMostRecentApprovedOrPendingVerifiedName } from '../utils';
import { useAsyncCall } from '../hooks';
import { SUCCESS_STATUS } from '../constants';

export const VerifiedNameContext = createContext();

export const VerifiedNameContextProvider = ({ children }) => {
  const verifiedNameHistoryData = useAsyncCall(getVerifiedNameHistory);

  let verifiedName = '';
  const { status, data } = verifiedNameHistoryData;
  if (status === SUCCESS_STATUS && data) {
    const { results } = data;
    verifiedName = getMostRecentApprovedOrPendingVerifiedName(results);
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
