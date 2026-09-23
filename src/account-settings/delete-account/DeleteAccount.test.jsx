import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { getSiteConfig, logError } from '@openedx/frontend-base';

import { renderWithProviders } from '@src/tests/renderWithProviders';
import { postDeleteAccount } from '@src/account-settings/delete-account/data/api';
import DeleteAccount from '@src/account-settings/delete-account/DeleteAccount';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

jest.mock('@src/account-settings/delete-account/data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  logError: jest.fn(),
}));

const openConfirmation = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Delete My Account' }));
  return screen.getByLabelText(/please enter your account password/);
};

describe('DeleteAccount', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders the section with the delete button enabled for a verified account', () => {
    renderWithProviders(<DeleteAccount />);

    expect(screen.getByText("We're sorry to see you go!")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete My Account' })).not.toBeDisabled();
    expect(screen.queryByText(/Before proceeding/)).not.toBeInTheDocument();
  });

  it('asks an unverified account to activate first', () => {
    renderWithProviders(<DeleteAccount isVerifiedAccount={false} />);

    expect(screen.getByRole('button', { name: 'Delete My Account' })).toBeDisabled();
    expect(screen.getByText('activate your account')).toBeInTheDocument();
  });

  it('asks an account with linked providers to unlink first', () => {
    renderWithProviders(<DeleteAccount hasLinkedTPA />);

    expect(screen.getByRole('button', { name: 'Delete My Account' })).toBeDisabled();
    expect(screen.getByText('unlink all social media accounts')).toBeInTheDocument();
  });

  it('explains when deletion is unavailable', () => {
    renderWithProviders(<DeleteAccount canDeleteAccount={false} />);

    expect(screen.getByText(/account deletion is currently unavailable/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete My Account' })).not.toBeInTheDocument();
  });

  it('requires a password before deleting', () => {
    renderWithProviders(<DeleteAccount />);
    openConfirmation();

    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect(screen.getAllByText('A password is required').length).toBeGreaterThan(0);
    expect(postDeleteAccount).not.toHaveBeenCalled();
  });

  it('reports a wrong password', async () => {
    postDeleteAccount.mockRejectedValue(Object.assign(new Error('Forbidden'), { response: { status: 403 } }));
    renderWithProviders(<DeleteAccount />);
    const passwordField = openConfirmation();

    fireEvent.change(passwordField, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect((await screen.findAllByText('Password is incorrect')).length).toBeGreaterThan(0);
    expect(postDeleteAccount).toHaveBeenCalledWith('wrong');
    expect(logError).not.toHaveBeenCalled();
  });

  it('reports and logs any other failure', async () => {
    const error = Object.assign(new Error('Server'), { response: { status: 500, data: 'oops' } });
    postDeleteAccount.mockRejectedValue(error);
    renderWithProviders(<DeleteAccount />);
    const passwordField = openConfirmation();

    fireEvent.change(passwordField, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect((await screen.findAllByText('Unable to delete account')).length).toBeGreaterThan(0);
    expect(logError).toHaveBeenCalledWith(error);
  });

  it('clears the error when the password changes', async () => {
    postDeleteAccount.mockRejectedValue(Object.assign(new Error('Forbidden'), { response: { status: 403 } }));
    renderWithProviders(<DeleteAccount />);
    const passwordField = openConfirmation();

    fireEvent.change(passwordField, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));
    await screen.findAllByText('Password is incorrect');

    fireEvent.change(passwordField, { target: { value: 'wrong2' } });

    await waitFor(() => expect(screen.queryByText('Password is incorrect')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument();
  });

  it('shows the farewell once the account is deleted', async () => {
    postDeleteAccount.mockResolvedValue({});
    renderWithProviders(<DeleteAccount />);
    const passwordField = openConfirmation();

    fireEvent.change(passwordField, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect(await screen.findByText(/Your account will be deleted shortly/)).toBeInTheDocument();
    expect(postDeleteAccount).toHaveBeenCalledWith('secret');
  });

  it('keeps the outcome when the password changes while the request is pending', async () => {
    let resolveDelete;
    postDeleteAccount.mockReturnValue(new Promise((resolve) => { resolveDelete = resolve; }));
    renderWithProviders(<DeleteAccount />);
    const passwordField = openConfirmation();

    fireEvent.change(passwordField, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));
    await waitFor(() => expect(postDeleteAccount).toHaveBeenCalledWith('secret'));

    fireEvent.change(passwordField, { target: { value: 'secret2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    resolveDelete({});

    expect(await screen.findByText(/Your account will be deleted shortly/)).toBeInTheDocument();
  });

  it('closes the confirmation on cancel', () => {
    renderWithProviders(<DeleteAccount />);
    openConfirmation();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText(/please enter your account password/)).not.toBeInTheDocument();
  });

  it('logs the learner out once they close the farewell', async () => {
    postDeleteAccount.mockResolvedValue({});
    const { location } = global;
    delete global.location;
    renderWithProviders(<DeleteAccount />);
    fireEvent.change(openConfirmation(), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));
    await screen.findByText(/Your account will be deleted shortly/);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(global.location).toBe(getSiteConfig().logoutUrl);
    global.location = location;
  });
});
