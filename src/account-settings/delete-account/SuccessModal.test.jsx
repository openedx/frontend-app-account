import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { SuccessModal } from './SuccessModal';

// Modal creates a portal. Mock createPortal for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node),
}));


describe('SuccessModal', () => {
  let props = {};
  let user;

  const renderComponent = (additionalProps = {}) => {
    return render(
      <IntlProvider locale="en">
        <SuccessModal
          {...props}
          {...additionalProps}
        />
      </IntlProvider>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    props = {
      onClose: jest.fn(),
      status: null,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render modal when status is null', () => {
    renderComponent();
    expect(screen.queryByText(/your account will be deleted shortly/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  });

  it('should not render modal when status is confirming', () => {
    renderComponent({ status: 'confirming' });
    
    expect(screen.queryByText(/your account will be deleted shortly/i)).not.toBeInTheDocument();
  });

  it('should not render modal when status is pending', () => {
    renderComponent({ status: 'pending' });

    expect(screen.queryByText(/your account will be deleted shortly/i)).not.toBeInTheDocument();
  });

  it('should not render modal when status is failed', () => {
    renderComponent({ status: 'failed' });
    
    expect(screen.queryByText(/your account will be deleted shortly/i)).not.toBeInTheDocument();
  });

  it('should render success modal when status is deleted', () => {
    renderComponent({ status: 'deleted' });
    
    expect(screen.queryByText(/your account will be deleted shortly/i)).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    renderComponent({ status: 'deleted' });
    
    const closeButton = screen.getByRole('button');
    
    await user.click(closeButton);
    
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle escape key press to close modal', async () => {
    renderComponent({ status: 'deleted' });
    
    expect(screen.queryByText(/your account will be deleted shortly/i)).toBeInTheDocument();
    
    await user.keyboard('{Escape}');

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });


  it('should display correct success message content', () => {
    renderComponent({ status: 'deleted' });
    
    expect(screen.queryByText(/your account will be deleted shortly/i)).toBeInTheDocument();
    
    expect(screen.getByText(/please unsubscribe from the footer of any email/i)).toBeInTheDocument();
  });

});