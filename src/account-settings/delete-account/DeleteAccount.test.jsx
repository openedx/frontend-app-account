/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@openedx/frontend-base';

// Mock the useDeleteAccount hook
jest.mock('./hooks/useDeleteAccount', () => ({
  useDeleteAccount: jest.fn(),
}));

import { DeleteAccount } from './DeleteAccount'; // eslint-disable-line import/first
import { useDeleteAccount } from './hooks/useDeleteAccount'; // eslint-disable-line import/first

describe('DeleteAccount', () => {
  let props = {};
  let user;
  let queryClient;
  let mockDeleteAccount;

  const renderComponent = (additionalProps = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <DeleteAccount
            {...props}
            {...additionalProps}
          />
        </IntlProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    user = userEvent.setup();
    
    mockDeleteAccount = jest.fn();
    
    useDeleteAccount.mockReturnValue({
      mutate: mockDeleteAccount,
      isLoading: false,
      error: null,
    });

    props = {
      hasLinkedTPA: false,
      isVerifiedAccount: true,
      canDeleteAccount: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient?.clear();
  });

  it('should render delete account section for verified account', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /delete.*account/i })).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /delete.*account/i })).toBeInTheDocument();
    
    expect(screen.queryByText('Your account will be deleted shortly.')).not.toBeInTheDocument();
  });

  it('should render different content for unverified account', () => {
    renderComponent({ isVerifiedAccount: false });

    expect(screen.getByRole('heading', { name: /delete.*account/i })).toBeInTheDocument();
    
    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    expect(deleteButton).toBeDisabled();
  });

  it('should show warning banner when account has linked third-party auth', () => {
    renderComponent({ hasLinkedTPA: true });

    expect(screen.getByText(/unlink/i)).toBeInTheDocument();
    
    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    expect(deleteButton).toBeDisabled();
  });

  it('should trigger delete confirmation when delete button is clicked', async () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    
    await user.click(deleteButton);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should show confirmation modal when status is pending', () => {
    renderComponent();
    
    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes, Delete/i })).toBeInTheDocument();
  });

  it('should call useDeleteAccount mutation when confirmation modal confirm is clicked', async () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    await user.click(deleteButton);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'test-password');

    const confirmButton = screen.getByRole('button', { name: /Yes, Delete/i });
    await user.click(confirmButton);

    expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
    expect(mockDeleteAccount).toHaveBeenCalledWith('test-password');
  });

  it('should handle cancel action properly', async () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /delete.*account/i });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });

  it('should show cannot delete message when canDeleteAccount is false', () => {
    renderComponent({ canDeleteAccount: false });

    expect(screen.getByText(/account deletion is currently unavailable./i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete.*account/i })).not.toBeInTheDocument();
  });

  it('should handle loading state from useDeleteAccount hook', () => {
    useDeleteAccount.mockReturnValue({
      mutate: mockDeleteAccount,
      isLoading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByRole('heading', { name: /delete.*account/i })).toBeInTheDocument();
  });
});