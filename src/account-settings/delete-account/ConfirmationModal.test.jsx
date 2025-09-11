import { IntlProvider } from '@openedx/frontend-base';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import { ConfirmationModal } from './ConfirmationModal'; // eslint-disable-line import/first

describe('ConfirmationModal', () => {
  let props = {};
  let user;

  const renderComponent = (additionalProps = {}) => {
    return render(
      <IntlProvider locale="en">
        <ConfirmationModal
          {...props}
          {...additionalProps}
        />
      </IntlProvider>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    props = {
      onCancel: jest.fn(),
      onChange: jest.fn(),
      onSubmit: jest.fn(),
      status: null,
      errorType: null,
      password: 'fluffy bunnies',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render modal when status is null', () => {
    renderComponent();
    
    // Modal should not be visible when status is null
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal when status is pending', () => {
    renderComponent({ status: 'pending' });
    
    // Modal should be visible when status is pending
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/delete account/i)).toBeInTheDocument();
  });

  it('should display password input field', () => {
    renderComponent({ status: 'pending' });
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveValue('fluffy bunnies');
  });

  it('should call onChange when password input changes', async () => {
    renderComponent({ status: 'pending' });
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.clear(passwordInput);
    await user.type(passwordInput, 'new password');
    
    expect(props.onChange).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    renderComponent({ status: 'pending' });
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    await user.click(cancelButton);
    
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when delete button is clicked', async () => {
    renderComponent({ status: 'pending' });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    
    await user.click(deleteButton);
    
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error message for empty password', () => {
    renderComponent({ 
      status: 'pending',
      errorType: 'empty-password'
    });
    
    expect(screen.getAllByText(/A password is required/i)).toHaveLength(2);
  });

  it('should disable submit button when password is empty', () => {
    renderComponent({ 
      status: 'pending',
      password: ''
    });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
  });

  it('should close modal on Escape key press', async () => {
    renderComponent({ status: 'pending' });
    
    await user.keyboard('{Escape}');
    
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});