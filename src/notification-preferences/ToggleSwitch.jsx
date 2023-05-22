import { Form } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ value, onChange }) => (
  <Form.Switch checked={value} onChange={(event) => onChange(event.target.checked)} />
);

ToggleSwitch.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

ToggleSwitch.defaultProps = {
  onChange: () => null,
};

export default React.memo(ToggleSwitch);
