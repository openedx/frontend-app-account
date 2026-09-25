import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import EditableField from '../EditableField';
import messages from '../AccountSettingsPage.messages';
import { renderWithForm } from './renderWithForm';

// eslint-disable-next-line react/prop-types
jest.mock('../certificate-preference/CertificatePreference', () => function MockCertificatePreference({ fieldName }) {
  return <div data-testid="editable-field-certificate-preference">Certificate Preference for {fieldName}</div>;
});

const mockOnSubmit = jest.fn();
const mockOnChange = jest.fn();

const renderComponent = (props = {}, form = {}) => renderWithForm(
  <EditableField
    name="username"
    label="Username"
    type="text"
    value="john_doe"
    onSubmit={mockOnSubmit}
    onChange={mockOnChange}
    {...props}
  />,
  { form },
);

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

  it('opens its form when Edit is clicked', () => {
    const { form } = renderComponent({}, { openForm: jest.fn() });
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(form.openForm).toHaveBeenCalledWith('username');
  });

  it('renders empty label with edit button if no value and editable', () => {
    renderComponent({ value: '', emptyLabel: 'Add value' });
    expect(screen.getByRole('button', { name: 'Add value' })).toBeInTheDocument();
  });

  it('renders empty label as muted text if not editable', () => {
    renderComponent({ value: '', emptyLabel: 'No value', isEditable: false });
    expect(screen.getByText('No value')).toHaveClass('text-muted');
  });

  it('renders editing state with form controls', () => {
    renderComponent({}, { openFormId: 'username' });
    expect(screen.getByTestId('editable-field-textbox')).toHaveValue('john_doe');
    expect(screen.getByTestId('editable-field-save')).toBeInTheDocument();
    expect(screen.getByTestId('editable-field-cancel')).toBeInTheDocument();
  });

  it('closes its form when Cancel is clicked', () => {
    const { form } = renderComponent({}, { openFormId: 'username', closeForm: jest.fn() });
    fireEvent.click(screen.getByTestId('editable-field-cancel'));
    expect(form.closeForm).toHaveBeenCalledWith('username');
  });

  it('calls onChange when input changes', () => {
    renderComponent({}, { openFormId: 'username' });
    fireEvent.change(screen.getByTestId('editable-field-textbox'), { target: { value: 'new_name' } });
    expect(mockOnChange).toHaveBeenCalledWith('username', 'new_name');
  });

  it('calls onSubmit when form is submitted', () => {
    renderComponent({}, { openFormId: 'username' });
    fireEvent.submit(screen.getByTestId('editable-field-form'));
    expect(mockOnSubmit).toHaveBeenCalledWith('username', 'john_doe');
  });

  it('shows the error recorded for this field', () => {
    renderComponent({}, { openFormId: 'username', errors: { username: 'Invalid input' } });
    expect(screen.getByTestId('editable-field-error')).toHaveTextContent('Invalid input');
  });

  it('shows help text in editing mode', () => {
    renderComponent({ helpText: 'Helpful info' }, { openFormId: 'username' });
    expect(screen.getByText('Helpful info')).toBeInTheDocument();
  });

  it('shows the pending confirmation in default mode', () => {
    renderComponent(
      { confirmationMessageDefinition: messages['account.settings.editable.field.action.save'] },
      { confirmationValues: { username: 'done' } },
    );
    expect(screen.getByTestId('editable-field-confirmation')).toBeInTheDocument();
  });

  it('renders CertificatePreference for name fields when editing', () => {
    renderComponent({ name: 'name' }, { openFormId: 'name' });
    expect(screen.getByTestId('editable-field-certificate-preference')).toHaveTextContent('Certificate Preference for name');
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
