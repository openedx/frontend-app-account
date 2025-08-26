import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import EditableField from '../EditableField';
import messages from '../AccountSettingsPage.messages';

jest.mock('../data/selectors', () => ({
  editableFieldSelector: () => (state, props) => ({
    ...state.accountSettings,
    isEditing: props.isEditing,
    error: props.error || state.accountSettings.errors[props.name],
    confirmationValue: props.confirmationValue || state.accountSettings.confirmationValues[props.name],
  }),
}));

jest.mock('../data/actions', () => ({
  openForm: jest.fn((name) => ({ type: 'OPEN_FORM', payload: name })),
  closeForm: jest.fn((name) => ({ type: 'CLOSE_FORM', payload: name })),
}));

// eslint-disable-next-line react/prop-types
jest.mock('../certificate-preference/CertificatePreference', () => function MockCertificatePreference({ fieldName }) {
  return <div data-testid="editable-field-certificate-preference">Certificate Preference for {fieldName}</div>;
});

const mockStore = configureStore([]);
const mockOnEdit = jest.fn();
const mockOnCancel = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnChange = jest.fn();

const baseState = {
  accountSettings: {
    errors: {},
    confirmationValues: {},
    saveState: 'default',
    openFormId: null,
    verifiedNameHistory: { results: [] },
    values: {},
    drafts: {},
    timeZones: [],
    countryTimeZones: [],
    thirdPartyAuth: { providers: [] },
    countriesCodesList: [],
    profileDataManager: false,
    nameChangeModal: {},
    loading: false,
    loaded: true,
    loadingError: null,
  },
};

const renderComponent = (props = {}, stateOverrides = {}) => {
  const store = mockStore({
    ...baseState,
    ...stateOverrides,
  });
  return render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <EditableField
          name="username"
          label="Username"
          type="text"
          value="john_doe"
          onEdit={mockOnEdit}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
          onChange={mockOnChange}
          isEditing={false}
          {...props}
        />
      </IntlProvider>
    </Provider>,
  );
};

describe('EditableField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default state with value', () => {
    renderComponent();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });

  it('renders empty label with edit button if no value and editable', () => {
    renderComponent({ value: '', emptyLabel: 'Add value' });
    expect(screen.getByRole('button', { name: 'Add value' })).toBeInTheDocument();
  });

  it('renders empty label as muted text if not editable', () => {
    renderComponent({ value: '', emptyLabel: 'No value', isEditable: false });
    expect(screen.getByText('No value')).toHaveClass('text-muted');
  });

  it('renders editing state with form controls', async () => {
    renderComponent({ isEditing: true });
    await waitFor(() => {
      expect(screen.getByTestId('editable-field-textbox')).toHaveValue('john_doe');
      expect(screen.getByTestId('editable-field-save')).toBeInTheDocument();
      expect(screen.getByTestId('editable-field-cancel')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('calls onChange when input changes', async () => {
    renderComponent({ isEditing: true });
    await waitFor(() => {
      const input = screen.getByTestId('editable-field-textbox');
      fireEvent.change(input, { target: { value: 'new_name' } });
      expect(mockOnChange).toHaveBeenCalledWith('username', 'new_name');
    }, { timeout: 2000 });
  });

  it('calls onSubmit when form is submitted', async () => {
    renderComponent({ isEditing: true });
    await waitFor(() => {
      const form = screen.getByTestId('editable-field-form');
      fireEvent.submit(form);
      expect(mockOnSubmit).toHaveBeenCalledWith('username', 'john_doe');
    }, { timeout: 2000 });
  });

  it('shows error message when error is present', async () => {
    const stateOverrides = {
      accountSettings: {
        ...baseState.accountSettings,
        errors: { username: 'Invalid input' },
      },
    };
    renderComponent({ isEditing: true, error: 'Invalid input' }, stateOverrides);
    await waitFor(() => {
      expect(screen.getByTestId('editable-field-error')).toHaveTextContent('Invalid input');
    }, { timeout: 2000 });
  });

  it('shows help text in editing mode', () => {
    renderComponent({ isEditing: true, helpText: 'Helpful info' });
    expect(screen.getByText('Helpful info')).toBeInTheDocument();
  });

  it('shows confirmation message in default mode if provided', async () => {
    const stateOverrides = {
      accountSettings: {
        ...baseState.accountSettings,
        confirmationValues: { username: 'done' },
      },
    };
    renderComponent(
      {
        confirmationMessageDefinition: messages['account.settings.editable.field.action.save'],
        confirmationValue: 'done',
      },
      stateOverrides,
    );
    await waitFor(() => {
      expect(screen.getByTestId('editable-field-confirmation')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders CertificatePreference for name fields when editing', async () => {
    renderComponent({ isEditing: true, name: 'name' });
    await waitFor(() => {
      expect(screen.getByTestId('editable-field-certificate-preference')).toHaveTextContent('Certificate Preference for name');
    }, { timeout: 2000 });
  });

  it('applies grayed-out class when isGrayedOut is true', () => {
    renderComponent({ isGrayedOut: true });
    expect(screen.getByText('john_doe')).toHaveClass('grayed-out');
  });

  it('appends userSuppliedValue when provided', () => {
    renderComponent({ userSuppliedValue: 'extra' });
    expect(screen.getByText('john_doe: extra')).toBeInTheDocument();
  });
});
