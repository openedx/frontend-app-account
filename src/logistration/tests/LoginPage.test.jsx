import React from 'react';
import { Provider } from 'react-redux';

import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import LoginPage from '../LoginPage';

// jest.mock('../data/selectors', () => {
//   return jest.fn().mockImplementation(() => ({ loginRequestSelector: () => ({}) }));
// });

// jest.mock('../data/selectors', () => {
//   return jest.fn().mockImplementation(() => ({ forgotPasswordSelector: () => ({}) }));
// });

const IntlLoginPage = injectIntl(LoginPage.WrappedComponent);
const mockStore = configureStore();
const history = createMemoryHistory();

describe('LoginPage', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
      <IntlProvider locale="en">
          <Provider store={store}>{children}</Provider>
      </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      loginResult: { success: false, redirectUrl: '' },
      forgotPassword: { status: null, email: ' ' },
      loginRequest: jest.fn(),
    };
  });

  it('should match default section snapshot', () => {
    const tree = renderer.create(reduxWrapper(<IntlLoginPage {...props} />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });


  it('should match url after redirection', () => {
    const dasboardUrl = 'http://test.com/dashboard/';
    props = {
      ...props,
      loginResult: { success: true, redirectUrl: dasboardUrl },
    };
    delete window.location;
    window.location = { href: '' };
    window.location.href = dasboardUrl;
    renderer.create(reduxWrapper(<IntlLoginPage {...props} />));
    expect(window.location.href).toBe(dasboardUrl);
  });
});
