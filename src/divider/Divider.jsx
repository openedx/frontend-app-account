import PropTypes from 'prop-types';
import classNames from 'classnames';

const Divider = ({ className, ...props }) => (
  <div className={classNames('divider', className)} {...props} />
);

Divider.propTypes = {
  className: PropTypes.string,
};

Divider.defaultProps = {
  className: undefined,
};

export default Divider;
