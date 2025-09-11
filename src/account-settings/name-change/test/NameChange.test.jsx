/* eslint-disable no-import-assign */
import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import { IntlProvider } from '@openedx/frontend-base';
import NameChangeModal from '../NameChange';
import { useSettingsFormDataState } from '../../hooks';
import { useNameChangeMutation } from '../hooks'; 
import { transformFormValues } from '../../hooks/utils'; 

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node),
}));

jest.mock('../../hooks', () => ({
  useSettingsFormDataState: jest.fn(),
}));

jest.mock('../hooks', () => ({
  useNameChangeMutation: jest.fn(),
}));

jest.mock('../../hooks/utils', () => ({
  transformFormValues: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(() => ({
    username: 'testuser',
  })),
}));


describe('NameChangeModal', () => {
  let props = {};
  let user;
  let mockCloseForm;
  let mockRequestNameChange;

  const renderComponent = (additionalProps = {}) => {
    return render(
      <Router>
        <IntlProvider locale="en">
          <NameChangeModal {...props} {...additionalProps} />
        </IntlProvider>
      </Router>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    
    mockCloseForm = jest.fn();
    mockRequestNameChange = jest.fn();

    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: {
          name: 'John Doe',
          verified_name: 'John Verified Doe',
        },
      },
      closeForm: mockCloseForm,
    });

    useNameChangeMutation.mockReturnValue({
      mutate: mockRequestNameChange,
    });

    transformFormValues.mockReturnValue({
      name: 'John Doe',
      verified_name: 'John Verified Doe',
    });

    props = {
      targetFormId: 'test_form',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render initial warning screen with continue button', () => {
    renderComponent();
    
    expect(screen.getByText(/This name change requires identity verification/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Warning: This action updates the name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should show input field after clicking continue button', async () => {
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    expect(screen.getByLabelText(/Before we begin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter.*name.*photo.*id/i)).toBeInTheDocument();
  });

  it('should populate input with verified_name when available', async () => {
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    expect(input).toHaveValue('John Verified Doe');
  });

  it('should render empty input when verified_name is not available', async () => {
    transformFormValues.mockReturnValue({
      name: 'John Doe',
      verified_name: '',
    });
    
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    expect(input).toHaveValue('');
  });

  it('should allow user to type in the input field', async () => {
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    await user.type(input, 'New Verified Name');
    
    expect(input).toHaveValue('New Verified Name');
  });

  it('should call requestNameChange on form submit with correct data', async () => {
    renderComponent({ targetFormId: 'name' });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    await user.type(input, 'Test Verified Name');
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);
    
    expect(mockRequestNameChange).toHaveBeenCalledWith({
      username: 'testuser',
      draftProfileName: 'John Doe',
      verifiedNameInput: 'Test Verified Name',
    });
  });

  it('should not include profile name when targetForm is not "name"', async () => {
    renderComponent({ targetFormId: 'other_form' });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    await user.type(input, 'Test Verified Name');
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);
    
    expect(mockRequestNameChange).toHaveBeenCalledWith({
      username: 'testuser',
      draftProfileName: null,
      verifiedNameInput: 'Test Verified Name',
    });
  });

  it('should show error message when submitting empty name', async () => {
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please enter a valid name/i)).toBeInTheDocument();
    
    expect(mockRequestNameChange).not.toHaveBeenCalled();
  });

  it('should close modal when cancel button is clicked', async () => {
    renderComponent();
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockCloseForm).toHaveBeenCalledWith('test_form');
  });

  it('should navigate to ID verification on successful submission', async () => {
    const mockSuccessCallback = jest.fn();
    useNameChangeMutation.mockImplementation((onSuccess) => {
      mockSuccessCallback.mockImplementation(onSuccess);
      return { mutate: mockRequestNameChange };
    });
    
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    await user.type(input, 'Test Name');
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);
    
    mockSuccessCallback();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/id-verification?next=account%2Fsettings');
      expect(mockCloseForm).toHaveBeenCalledWith('test_form');
    });
  });

  it('should handle mutation errors properly', async () => {
    const mockErrorCallback = jest.fn();
    useNameChangeMutation.mockImplementation((onSuccess, onError) => {
      mockErrorCallback.mockImplementation(onError);
      return { mutate: mockRequestNameChange };
    });
    
    renderComponent();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    await user.clear(input);
    await user.type(input, 'Test Name');
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);
    
    const mockError = {
      customAttributes: {
        httpErrorResponseData: {
          verified_name: 'Invalid name format',
        },
      },
    };
    mockErrorCallback(mockError);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid name format')).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', async () => {
    renderComponent();
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);
    
    const input = screen.getByPlaceholderText(/enter.*name.*photo.*id/i);
    expect(input).toHaveAccessibleName();
    expect(input).toHaveAttribute('type', 'text');
  });

});