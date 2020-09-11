import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { render, cleanup, screen, act, fireEvent } from '@testing-library/react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import LoginPage from '../LoginPage'; // eslint-disable-line import/first
import { Button } from '@edx/paragon';

const IntlLoginPage = injectIntl(LoginPage);
const mockStore = configureStore();
const history = createMemoryHistory();

describe('LoginPage', () => {
  const initialState = {
    logistration: {
      forgotPassword: {
        status: null
      }
    }
  };

  let props = {};
  let store = {};

  const reduxWrapper = children => (
      <IntlProvider locale="en">
          <Provider store={store}>{children}</Provider>
      </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore(initialState);
    props = {};
  });

  it('should match default section snapshot', () => {
    const tree = renderer.create(reduxWrapper(<IntlLoginPage {...props} />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display login help button', () => {
    const root = mount(reduxWrapper(<IntlLoginPage {...props} />));
    expect(root.find('.field-link').text()).toEqual('Need help signing in?');
  });
});
