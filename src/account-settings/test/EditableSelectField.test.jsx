import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';

// Mock the useSettingsFormDataState hook
jest.mock('../hooks', () => ({
  useSettingsFormDataState: jest.fn(),
}));

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(() => ({
    userId: 123,
    username: 'test-user',
  })),
}));

// Import component and hooks after mocks
import EditableSelectField from '../EditableSelectField'; // eslint-disable-line import/first
import { useSettingsFormDataState } from '../hooks'; // eslint-disable-line import/first

describe('EditableSelectField', () => {
  let props = {};
  let user;
  let mockOpenForm;
  let mockCloseForm;

  const renderComponent = (additionalProps = {}) => {
    return render(
      <Router>
        <IntlProvider locale="en">
          <EditableSelectField {...props} {...additionalProps} />
        </IntlProvider>
      </Router>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    
    // Create mock functions
    mockOpenForm = jest.fn();
    mockCloseForm = jest.fn();

    // Mock useSettingsFormDataState
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: null,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });

    props = {
      name: 'testField',
      label: 'Main Label',
      emptyLabel: 'Empty Main Label',
      type: 'text',
      value: 'Test Field',
      userSuppliedValue: '',
      options: [
        { label: 'Default Option', value: 'defaultOption' },
        {
          label: 'User Options',
          group: [{ label: 'Suboption 1', value: 'suboption1' }],
        },
        {
          label: 'Other Options',
          group: [
            { label: 'Suboption 2', value: 'suboption2' },
            { label: 'Suboption 3', value: 'suboption3' },
          ],
        },
      ],
      confirmationMessageDefinition: {
        id: 'confirmationMessageId',
        defaultMessage: 'Default Confirmation Message',
        description: 'Description of the confirmation message',
      },
      helpText: 'Helpful Text',
      isEditable: true,
      isGrayedOut: false,
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders EditableSelectField correctly with editing disabled', () => {
    renderComponent();
    
    expect(screen.getByText('Main Label')).toBeInTheDocument();
    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: "Default Option"})).not.toBeInTheDocument(); 
  });

  it('renders EditableSelectField correctly with editing enabled', async () => {
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    renderComponent();

    expect(screen.getByRole('option', { name: "Default Option"})).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders EditableSelectField with an error', () => {
     useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: { [props.name]: 'This is an error message' },
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    renderComponent();

    screen.debug();

    expect(screen.getByText(/This is an error message/)).toBeInTheDocument();
    expect(screen.getByText(/This is an error message/).parentElement).toHaveClass(/text-invalid/);
  });

  it('renders selectOptions when option has a group', () => {
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    const propsWithGroup = {
      options: [{
        label: 'User Options',
        group: [{ label: 'Suboption 1', value: 'suboption1' }],
      }],
    };
    
    renderComponent(propsWithGroup);
    
    const selectElement = screen.getByRole('group');
    expect(selectElement).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'User Options' })).toBeInTheDocument();
  });

  it('renders selectOptions when option does not have a group', () => {
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    const propsWithoutGroup = {
      options: [{ label: 'Default Option', value: 'defaultOption' }],
    };
    
    renderComponent(propsWithoutGroup);
    
    const selectElement = screen.getByRole('option');
    expect(selectElement).toBeInTheDocument();
    expect(screen.getByText('Default Option')).toBeInTheDocument();
  });

  it('opens edit mode when edit button is clicked', async () => {
    renderComponent();
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(mockOpenForm).toHaveBeenCalledWith('testField');
  });

  it('saves field when save button is clicked', async () => {
     useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    const mockOnSubmit = jest.fn();
    renderComponent({ onSubmit: mockOnSubmit });

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('testField', 'Test Field');
  });

  it('closes form when cancel button is clicked', async () => {
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        formValues: { testField: 'Test Field' },
        saveState: 'default',
        errors: {},
        openFormId: props.name,
      },
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
    });
    renderComponent();
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockCloseForm).toHaveBeenCalledWith('testField');
  });

  it('displays help text when provided', () => {
    renderComponent();
    
    expect(screen.getByText('Helpful Text')).toBeInTheDocument();
  });
});