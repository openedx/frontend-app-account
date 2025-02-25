import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { TestableEditableCheckboxField } from '../EditableCheckboxField';

jest.mock('@edx/frontend-platform/auth');

jest.mock('../data/actions', () => ({
  openForm: jest.fn(),
  closeForm: jest.fn(),
}));

describe('EditableCheckboxField', () => {
  let props;

  const componentWrapper = (children) => (
    <Router>
      <IntlProvider locale="en">
        {children}
      </IntlProvider>
    </Router>
  );

  beforeEach(() => {
    props = {
      name: 'testCheckbox',
      label: 'Checkbox Label',
      emptyLabel: 'Empty Checkbox Label',
      type: 'checkbox',
      value: false,
      userSuppliedValue: '',
      saveState: 'default',
      error: '',
      confirmationMessageDefinition: {
        id: 'confirmationMessageId',
        defaultMessage: 'Default Confirmation Message',
        description: 'Description of the confirmation message',
      },
      confirmationValue: 'Confirmation Value',
      helpText: 'Helpful Text',
      isEditing: false,
      isEditable: true,
      isGrayedOut: false,
      onSubmit: jest.fn(),
      onChange: jest.fn(),
      onCancel: jest.fn(),
      onEdit: jest.fn(),
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders correctly with editing disabled', () => {
    const tree = renderer.create(componentWrapper(<TestableEditableCheckboxField {...props} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when editing is enabled', () => {
    props.isEditing = true;
    const tree = renderer.create(componentWrapper(<TestableEditableCheckboxField {...props} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders confirmation message when provided', () => {
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    expect(screen.getByText('Default Confirmation Message')).toBeInTheDocument();
  });

  it('does not render edit button when isEditable is false', () => {
    props.isEditable = false;
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
  });

  it('renders as grayed out when isGrayedOut is true', () => {
    props.isGrayedOut = true;
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    expect(screen.getByText('No').closest('p')).toHaveClass('grayed-out');
  });

  it('calls onChange with correct arguments when checkbox value changes', () => {
    props.isEditing = true;
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(props.onChange).toHaveBeenCalledWith('testCheckbox', true);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);
    expect(props.onEdit).toHaveBeenCalledWith('testCheckbox');
  });

  it('calls onCancel when cancel button is clicked', () => {
    props.isEditing = true;
    render(componentWrapper(<TestableEditableCheckboxField {...props} />));
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(props.onCancel).toHaveBeenCalledWith(props.name);
  });
});
