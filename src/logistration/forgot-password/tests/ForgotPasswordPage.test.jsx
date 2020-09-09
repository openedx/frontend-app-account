import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import ForgotPasswordPage from '../ForgotPasswordPage'; // eslint-disable-line import/first

jest.mock('../../data/selectors', () => {
  return jest.fn().mockImplementation(() => ({ forgotPasswordSelector: () => ({}) })); 
});

const IntlForgotPasswordPage = injectIntl(ForgotPasswordPage);
const mockStore = configureStore();
const history = createMemoryHistory();

describe('ForgotPasswordPage', () => {
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
      forgotPassword: jest.fn(),
      status: null,
    };
  });

  it('should match default section snapshot', () => {
    const tree = renderer.create(reduxWrapper(<IntlForgotPasswordPage {...props} />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match forbidden section snapshot', () => {
    props = {
      ...props,
      status: 'forbidden',
    }
    const tree = renderer.create(reduxWrapper(<IntlForgotPasswordPage {...props} />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match success section snapshot', () => {
    props = {
      ...props,
      status: 'complete',
    }
    const tree = renderer.create(
      reduxWrapper(
        <Router history={history}>
          <IntlForgotPasswordPage {...props} />
        </Router>
      )
    );
    expect(history.location.pathname).toEqual('/login');
  });
});
