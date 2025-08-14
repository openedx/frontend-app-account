import PropTypes from 'prop-types';

const MockedSlot = ({ children, id }) => (
  <div data-testid={id}>
    Slot{id}
    { children && <div>{children}</div> }
  </div>
);

MockedSlot.displayName = 'Slot';

MockedSlot.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  id: PropTypes.string,
};

MockedSlot.defaultProps = {
  children: undefined,
  id: undefined,
};

export default MockedSlot;
