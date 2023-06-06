import { Form } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({
  name,
  value,
  disabled,
  onChange,
}) => (
  <Form.Switch
    name={name}
    checked={value}
    disabled={disabled}
    onChange={onChange}
  />
);

ToggleSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

ToggleSwitch.defaultProps = {
  onChange: () => null,
  disabled: false,
};

export default React.memo(ToggleSwitch);
