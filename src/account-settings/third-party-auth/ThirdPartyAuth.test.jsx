import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { logError } from '@openedx/frontend-base';

import { renderWithProviders } from '@src/tests/renderWithProviders';
import { getThirdPartyAuthProviders, postDisconnectAuth } from '@src/account-settings/third-party-auth/data/api';
import ThirdPartyAuth from '@src/account-settings/third-party-auth/ThirdPartyAuth';

jest.mock('@src/account-settings/third-party-auth/data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  logError: jest.fn(),
}));

const google = {
  id: 'oa2-google-oauth2',
  name: 'Google',
  connected: true,
  connectUrl: 'http://lms/auth/login/google-oauth2/',
  disconnectUrl: 'http://lms/auth/disconnect/google-oauth2/',
};
const facebook = {
  id: 'oa2-facebook',
  name: 'Facebook',
  connected: false,
  connectUrl: 'http://lms/auth/login/facebook/',
  disconnectUrl: 'http://lms/auth/disconnect/facebook/',
};

describe('ThirdPartyAuth', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders nothing until the providers arrive', () => {
    getThirdPartyAuthProviders.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<ThirdPartyAuth />);

    expect(container).toBeEmptyDOMElement();
  });

  it('says so when there are no providers', async () => {
    getThirdPartyAuthProviders.mockResolvedValue([]);
    renderWithProviders(<ThirdPartyAuth />);

    expect(await screen.findByText('No accounts can be linked at this time.')).toBeInTheDocument();
  });

  it('offers to link unconnected providers and unlink connected ones', async () => {
    getThirdPartyAuthProviders.mockResolvedValue([google, facebook]);
    renderWithProviders(<ThirdPartyAuth />);

    expect(await screen.findByRole('link', { name: 'Sign in with Facebook' })).toHaveAttribute('href', facebook.connectUrl);
    expect(screen.getByRole('button', { name: 'Unlink Google account' })).toBeInTheDocument();
    expect(screen.getByText('Linked')).toBeInTheDocument();
  });

  it('disconnects a provider and refetches the list', async () => {
    getThirdPartyAuthProviders
      .mockResolvedValueOnce([google])
      .mockResolvedValueOnce([{ ...google, connected: false }]);
    postDisconnectAuth.mockResolvedValue({});
    renderWithProviders(<ThirdPartyAuth />);

    fireEvent.click(await screen.findByRole('button', { name: 'Unlink Google account' }));

    expect(await screen.findByRole('link', { name: 'Sign in with Google' })).toBeInTheDocument();
    expect(postDisconnectAuth).toHaveBeenCalledWith(google.disconnectUrl);
    expect(getThirdPartyAuthProviders).toHaveBeenCalledTimes(2);
  });

  it('reports a failed disconnection on the provider', async () => {
    const error = new Error('Server');
    getThirdPartyAuthProviders.mockResolvedValue([google]);
    postDisconnectAuth.mockRejectedValue(error);
    renderWithProviders(<ThirdPartyAuth />);

    fireEvent.click(await screen.findByRole('button', { name: 'Unlink Google account' }));

    expect(await screen.findByText(/There was a problem disconnecting this account/)).toBeInTheDocument();
    expect(logError).toHaveBeenCalledWith(error);
    expect(screen.getByRole('button', { name: 'Unlink Google account' })).toBeInTheDocument();
  });

  it('ignores clicks while a disconnection is pending', async () => {
    getThirdPartyAuthProviders.mockResolvedValue([google]);
    postDisconnectAuth.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ThirdPartyAuth />);

    const button = await screen.findByRole('button', { name: 'Unlink Google account' });
    fireEvent.click(button);
    await waitFor(() => expect(postDisconnectAuth).toHaveBeenCalledTimes(1));

    fireEvent.click(button);
    expect(postDisconnectAuth).toHaveBeenCalledTimes(1);
  });
});
