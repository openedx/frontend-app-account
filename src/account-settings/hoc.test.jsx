import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { withLocation, withNavigate } from './hoc';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigator,
  useLocation: () => ({
    pathname: '/current-location',
  }),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ navigate, location }) => (
  // eslint-disable-next-line react/button-has-type, react/prop-types
  <button data-testid="btn" onClick={() => navigate('/some-route')}>{location}</button>
);
const WrappedComponent = withNavigate(withLocation(MockComponent));

test('Provide Navigation to Component', () => {
  render(
    <WrappedComponent />,
  );
  const btn = screen.getByTestId('btn');
  fireEvent.click(btn);

  expect(mockedNavigator).toHaveBeenCalledWith('/some-route');
});

test('Provide Location Pathname to Component', () => {
  render(
    <WrappedComponent />,
  );

  expect(screen.getByTestId('btn').textContent).toContain('/current-location');
});
