import React from 'react';
import PropTypes from 'prop-types';
import { TransitionReplace } from '@openedx/paragon';

const onChildExit = (htmlNode) => {
  // If the leaving child has focus, take control and redirect it
  if (htmlNode.contains(document.activeElement)) {
    // Get the newly entering sibling.
    // It's the previousSibling, but not for any explicit reason. So checking for both.
    const enteringChild = htmlNode.previousSibling || htmlNode.nextSibling;

    // There's no replacement, do nothing.
    if (!enteringChild) {
      return;
    }

    // Get all the focusable elements in the entering child and focus the first one
    const focusableElements = enteringChild.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }
};

const SwitchContent = ({ expression, cases, className }) => {
  const getContent = (caseKey) => {
    if (cases[caseKey]) {
      if (typeof cases[caseKey] === 'string') {
        return getContent(cases[caseKey]);
      }
      return React.cloneElement(cases[caseKey], { key: caseKey });
    }
    if (cases.default) {
      if (typeof cases.default === 'string') {
        return getContent(cases.default);
      }
      React.cloneElement(cases.default, { key: 'default' });
    }

    return null;
  };

  return (
    <TransitionReplace
      className={className}
      onChildExit={onChildExit}
    >
      {getContent(expression)}
    </TransitionReplace>
  );
};

SwitchContent.propTypes = {
  expression: PropTypes.string,
  cases: PropTypes.objectOf(PropTypes.node).isRequired,
  className: PropTypes.string,
};

SwitchContent.defaultProps = {
  expression: null,
  className: null,
};

export default SwitchContent;
