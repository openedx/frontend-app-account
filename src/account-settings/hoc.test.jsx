import React from 'react';
import { mount } from 'enzyme';

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
  <button id="btn" onClick={() => navigate('/some-route')}>{location}</button>
);
const WrappedComponent = withNavigate(withLocation(MockComponent));

test('Provide Navigation to Component', () => {
  const wrapper = mount(
    <WrappedComponent />,
  );
  const btn = wrapper.find('#btn');
  btn.simulate('click');

  expect(mockedNavigator).toHaveBeenCalledWith('/some-route');
});

test('Provide Location Pathname to Component', () => {
  const wrapper = mount(
    <WrappedComponent />,
  );

  expect(wrapper.find('#btn').text()).toContain('/current-location');
});
