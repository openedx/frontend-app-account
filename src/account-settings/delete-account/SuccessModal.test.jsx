import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';

import { SuccessModal } from '@src/account-settings/delete-account/SuccessModal';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node),
}));

const header = /Your account will be deleted shortly/;

describe('SuccessModal', () => {
  it.each([null, 'confirming', 'pending', 'failed'])('stays closed while the status is %s', (status) => {
    render(<IntlProvider locale="en"><SuccessModal status={status} onClose={jest.fn()} /></IntlProvider>);

    expect(screen.queryByText(header)).not.toBeInTheDocument();
  });

  it('confirms the deletion and closes on request', async () => {
    const user = userEvent.setup();

    const onClose = jest.fn();
    render(<IntlProvider locale="en"><SuccessModal status="deleted" onClose={onClose} /></IntlProvider>);

    expect(screen.getByText(header)).toBeInTheDocument();
    expect(screen.getByText(/Account deletion, including removal from email lists/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });
});
