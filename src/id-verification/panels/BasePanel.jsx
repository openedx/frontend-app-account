import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { useVerificationRedirectSlug } from '../routing-utilities';

export default function BasePanel({
  children,
  focusOnMount,
  name,
  title,
}) {
  const headingRef = useRef();

  // focus heading element on mount
  useEffect(() => {
    if (focusOnMount && headingRef.current) {
      headingRef.current.focus();
    }
  }, [headingRef.current]);

  const redirectSlug = useVerificationRedirectSlug(name);
  if (redirectSlug) {
    return <Redirect to={redirectSlug} />;
  }

  return (
    <div className={`verification-panel ${name}-panel`}>
      <h3 aria-level="1" ref={headingRef} tabIndex="-1">{title}</h3>
      {children}
    </div>
  );
}

BasePanel.propTypes = {
  children: PropTypes.node.isRequired,
  focusOnMount: PropTypes.bool,
  name: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
};

BasePanel.defaultProps = {
  focusOnMount: true,
};
