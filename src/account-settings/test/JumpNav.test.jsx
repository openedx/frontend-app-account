import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp, mergeConfig, setConfig } from '@edx/frontend-platform';

import JumpNav from '../JumpNav';
import configureStore from '../../data/configureStore';

describe('JumpNav', () => {
  mergeConfig({
    ENABLE_ACCOUNT_DELETION: true,
  });

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
        <AppProvider store={store}>
          <JumpNav />
        </AppProvider>
      </IntlProvider>,
    );

    expect(await screen.queryByText('Delete My Account')).toBeNull();
  });

  it('should render delete account link', async () => {
    setConfig({
      ENABLE_ACCOUNT_DELETION: true,
    });

    render(
      <IntlProvider locale="en">
        <AppProvider store={store}>
          <JumpNav />
        </AppProvider>
      </IntlProvider>,
    );

    expect(await screen.findByText('Delete My Account')).toBeVisible();
  });
});
