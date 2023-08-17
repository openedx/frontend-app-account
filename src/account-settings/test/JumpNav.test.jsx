import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp, mergeConfig, setConfig } from '@edx/frontend-platform';

import JumpNav from '../JumpNav';
import configureStore from '../../data/configureStore';

const IntlJumpNav = injectIntl(JumpNav);

describe('JumpNav', () => {
  mergeConfig({
    ENABLE_DEMOGRAPHICS_COLLECTION: false,
  });

  let props = {};
  let store;

  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    props = {
      intl: {},
      displayDemographicsLink: false,
    };
    store = configureStore({
      notificationPreferences: {
        showPreferences: false,
      },
    });
  });

  it('should not render Optional Information link', () => {
    const tree = renderer.create((
      <IntlProvider locale="en">
        <AppProvider store={store}>
          <IntlJumpNav {...props} />
        </AppProvider>
      </IntlProvider>
    ))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render Optional Information link', () => {
    setConfig({
      ENABLE_DEMOGRAPHICS_COLLECTION: true,
    });

    props = {
      ...props,
      displayDemographicsLink: true,
    };

    const tree = renderer.create((
      <IntlProvider locale="en">
        <AppProvider store={store}>
          <IntlJumpNav {...props} />
        </AppProvider>
      </IntlProvider>
    ))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
