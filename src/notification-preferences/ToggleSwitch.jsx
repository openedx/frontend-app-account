import { Form } from '@openedx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({
  name,
  value,
  disabled,
  onChange,
  id,
}) => (
  <Form.Switch
    name={name}
    checked={value}
    disabled={disabled}
    onChange={onChange}
    data-testid={id}
  />
);

ToggleSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  onChange: () => null,
  disabled: false,
  id: '',
};

export default React.memo(ToggleSwitch);
