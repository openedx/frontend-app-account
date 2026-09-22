import { screen, waitFor } from '@testing-library/react';
import { mergeAppConfig } from '@openedx/frontend-base';

import { renderWithProviders } from '../../tests/renderWithProviders';
import { getNotificationPreferences } from '../../notification-preferences/data/api';
import JumpNav from '../JumpNav';
import { appId } from '../../constants';

jest.mock('../../notification-preferences/data/api');

describe('JumpNav', () => {
  beforeEach(() => {
    getNotificationPreferences.mockResolvedValue({ show_preferences: false, data: {} });
  });

  afterEach(() => jest.clearAllMocks());

  it('should not render delete account link', async () => {
    mergeAppConfig(appId, { ENABLE_ACCOUNT_DELETION: false });

    renderWithProviders(<JumpNav />);

    await waitFor(() => expect(getNotificationPreferences).toHaveBeenCalled());
    expect(screen.queryByText('Delete My Account')).toBeNull();
  });

  it('should render delete account link', async () => {
    mergeAppConfig(appId, { ENABLE_ACCOUNT_DELETION: true });

    renderWithProviders(<JumpNav />);

    expect(await screen.findByText('Delete My Account')).toBeVisible();
  });

  it('should not render notifications link when show_preferences is false', async () => {
    renderWithProviders(<JumpNav />);

    await waitFor(() => expect(getNotificationPreferences).toHaveBeenCalled());
    expect(screen.queryByText('Notifications')).toBeNull();
  });

  it('should render notifications link when show_preferences is true', async () => {
    getNotificationPreferences.mockResolvedValue({ show_preferences: true, data: {} });

    renderWithProviders(<JumpNav />);

    expect(await screen.findByText('Notifications')).toBeVisible();
  });
});
