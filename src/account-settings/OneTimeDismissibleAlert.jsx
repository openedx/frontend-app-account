import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@edx/paragon';

export default function OneTimeDismissibleAlert(props) {
  const [dismissed, setDismissed] = useState(localStorage.getItem(props.id) !== 'true');

  const onClose = () => {
    localStorage.setItem(props.id, 'true');
    setDismissed(false);
  };

  return (
    <Alert
      variant={props.variant}
      dismissible
      icon={props.icon}
      onClose={onClose}
      show={dismissed}
    >
      <Alert.Heading>{props.header}</Alert.Heading>
      <p>
        {props.body}
      </p>
    </Alert>
  );
}

OneTimeDismissibleAlert.propTypes = {
  id: PropTypes.string.isRequired,
  variant: PropTypes.string,
  icon: PropTypes.func,
  header: PropTypes.string,
  body: PropTypes.string,
};

OneTimeDismissibleAlert.defaultProps = {
  variant: 'success',
  icon: undefined,
  header: undefined,
  body: undefined,
};
