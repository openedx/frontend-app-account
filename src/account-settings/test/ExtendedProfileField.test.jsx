import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ExtendedProfileField from '../ExtendedProfileField';
import messages from '../AccountSettingsPage.messages';

jest.mock('../EditableSelectField', () => jest.fn(() => <div data-testid="editable-select" />));
jest.mock('../EditableField', () => jest.fn(() => <div data-testid="editable-field" />));
jest.mock('../EditableCheckboxField', () => jest.fn(() => <div data-testid="editable-checkbox" />));

describe('ExtendedProfileField', () => {
  const renderComponent = (field) => render(
    <IntlProvider locale="en" messages={messages}>
      <ExtendedProfileField field={field} intl={{ formatMessage: jest.fn(() => 'Empty field') }} />
    </IntlProvider>,
  );

  it('renders EditableSelectField when field type is select', () => {
    renderComponent({
      name: 'country', type: 'select', label: 'Country', field_value: '', options: [['us', 'USA'], ['ca', 'Canada']],
    });
    expect(screen.getByTestId('editable-select')).toBeInTheDocument();
  });

  it('renders EditableCheckboxField when field type is checkbox', () => {
    renderComponent({
      name: 'newsletter', type: 'checkbox', label: 'Subscribe', field_value: 'false',
    });
    expect(screen.getByTestId('editable-checkbox')).toBeInTheDocument();
  });

  it('renders EditableField for other types', () => {
    renderComponent({
      name: 'first_name', type: 'text', label: 'First Name', field_value: 'John',
    });
    expect(screen.getByTestId('editable-field')).toBeInTheDocument();
  });
});
