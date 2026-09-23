import { fireEvent, render, screen } from '@testing-library/react';
import { getSiteConfig, IntlProvider, mergeSiteConfig } from '@openedx/frontend-base';

import ConfirmationModal from '@src/account-settings/delete-account/ConfirmationModal';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node),
}));

const renderModal = (props = {}) => render(
  <IntlProvider locale="en">
    <ConfirmationModal
      onCancel={jest.fn()}
      onChange={jest.fn()}
      onSubmit={jest.fn()}
      password="fluffy bunnies"
      {...props}
    />
  </IntlProvider>,
);

describe('ConfirmationModal', () => {
  it('stays closed without a status', () => {
    renderModal();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('asks for the password once the learner is confirming', () => {
    renderModal({ status: 'confirming' });

    expect(screen.getByRole('dialog', { name: 'Are you sure?' })).toBeInTheDocument();
    expect(screen.getByLabelText(/please enter your account password/)).toHaveValue('fluffy bunnies');
    expect(screen.queryByText('A password is required')).not.toBeInTheDocument();
  });

  it('reports an empty password without blaming the server', () => {
    renderModal({ status: 'pending', errorType: 'empty-password' });

    expect(screen.getAllByText('A password is required').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sorry, there was an error/)).not.toBeInTheDocument();
  });

  it('reports a failed request with details', () => {
    renderModal({ status: 'failed', errorType: 'server' });

    expect(screen.getAllByText('Unable to delete account').length).toBeGreaterThan(0);
    expect(screen.getByText(/Sorry, there was an error/)).toBeInTheDocument();
  });

  it('uses the edx.org wording on edx.org', () => {
    const { siteName } = getSiteConfig();
    mergeSiteConfig({ siteName: 'edX' });
    renderModal({ status: 'confirming' });
    mergeSiteConfig({ siteName });

    expect(screen.getByText(/unable to use this account to take courses on the edX app/)).toBeInTheDocument();
  });

  it('calls back on cancel and on delete', () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    renderModal({ status: 'confirming', onCancel, onSubmit });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
