import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export const withNavigate = Component => {
  const WrappedComponent = props => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return WrappedComponent;
};

export const withLocation = Component => {
  const WrappedComponent = props => {
    const location = useLocation();
    return <Component {...props} location={location.pathname} />;
  };
  return WrappedComponent;
};
