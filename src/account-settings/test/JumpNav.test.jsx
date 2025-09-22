import { IntlProvider, initializeMockApp, CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { render, screen } from '@testing-library/react';
import { appId } from '../../constants';

import JumpNav from '../JumpNav';
import { MemoryRouter } from 'react-router';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAppConfig: jest.fn(),
}));

describe('JumpNav', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
  });

  it('should not render delete account link', async () => {
    jest.mocked(getAppConfig).mockReturnValue({
      ENABLE_ACCOUNT_DELETION: false,
    });
    render(
      <CurrentAppProvider appId={appId}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <JumpNav />
          </IntlProvider>
        </MemoryRouter>
      </CurrentAppProvider>
    );

    expect(await screen.queryByText('Delete My Account')).toBeNull();
  });

  it('should render delete account link', async () => {
    jest.mocked(getAppConfig).mockReturnValue({
      ENABLE_ACCOUNT_DELETION: true,
    });
    render(
      <CurrentAppProvider appId={appId}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <JumpNav />
          </IntlProvider>
        </MemoryRouter>
      </CurrentAppProvider>
    );

    expect(await screen.findByText('Delete My Account')).toBeVisible();
  });
});
