import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Alert(props) {
  return (
    <div className={classNames('alert d-flex align-items-start', props.className)}>
      <div>
        {props.icon}
      </div>
      <div>
        {props.children}
      </div>
    </div>
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
};

Alert.defaultProps = {
  className: undefined,
  icon: undefined,
  children: undefined,
};

export default Alert;
