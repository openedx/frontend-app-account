import { IntlProvider, SiteProvider, initializeMockApp, injectIntl, mergeConfig, setConfig } from '@openedx/frontend-base';
import { render, screen } from '@testing-library/react';

import configureStore from '../../data/configureStore';
import JumpNav from '../JumpNav';

const IntlJumpNav = injectIntl(JumpNav);

describe('JumpNav', () => {
  mergeConfig({
    ENABLE_ACCOUNT_DELETION: true,
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
    };
    store = configureStore({
      notificationPreferences: {
        showPreferences: false,
      },
    });
  });

  it('should not render delete account link', async () => {
    setConfig({
      ENABLE_ACCOUNT_DELETION: false,
    });

    render(
      <IntlProvider locale="en">
        <SiteProvider store={store}>
          <IntlJumpNav {...props} />
        </SiteProvider>
      </IntlProvider>,
    );

    expect(await screen.queryByText('Delete My Account')).toBeNull();
  });

  it('should render delete account link', async () => {
    setConfig({
      ENABLE_ACCOUNT_DELETION: true,
    });

    props = {
      ...props,
    };

    render(
      <IntlProvider locale="en">
        <SiteProvider store={store}>
          <IntlJumpNav {...props} />
        </SiteProvider>
      </IntlProvider>,
    );

    expect(await screen.findByText('Delete My Account')).toBeVisible();
  });
});
