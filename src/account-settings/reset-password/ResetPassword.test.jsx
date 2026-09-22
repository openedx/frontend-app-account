import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { logError } from '@openedx/frontend-base';

import { renderWithProviders } from '../../tests/renderWithProviders';
import { postResetPassword } from './data/api';
import ResetPassword from './ResetPassword';

jest.mock('./data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  logError: jest.fn(),
}));

describe('ResetPassword', () => {
  afterEach(() => jest.clearAllMocks());

  it('requests a reset for the email and confirms it was sent', async () => {
    postResetPassword.mockResolvedValue({});
    renderWithProviders(<ResetPassword email="learner@example.com" />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(await screen.findByText(/We've sent a message to/)).toBeInTheDocument();
    expect(postResetPassword).toHaveBeenCalledWith('learner@example.com');
  });

  it('tells the learner when a previous request is still in progress', async () => {
    postResetPassword.mockRejectedValue(Object.assign(new Error('Forbidden'), { response: { status: 403 } }));
    renderWithProviders(<ResetPassword email="learner@example.com" />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(await screen.findByText(/Your previous request is in progress/)).toBeInTheDocument();
    expect(logError).not.toHaveBeenCalled();
  });

  it('logs any other failure and shows nothing', async () => {
    const error = new Error('Server');
    postResetPassword.mockRejectedValue(error);
    renderWithProviders(<ResetPassword email="learner@example.com" />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => expect(logError).toHaveBeenCalledWith(error));
    expect(screen.queryByText(/We've sent a message to/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Your previous request is in progress/)).not.toBeInTheDocument();
  });

  it('ignores clicks while a request is pending', async () => {
    postResetPassword.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ResetPassword email="learner@example.com" />);

    const button = screen.getByRole('button', { name: 'Reset Password' });
    fireEvent.click(button);
    await waitFor(() => expect(postResetPassword).toHaveBeenCalledTimes(1));

    fireEvent.click(button);
    expect(postResetPassword).toHaveBeenCalledTimes(1);
  });
});
