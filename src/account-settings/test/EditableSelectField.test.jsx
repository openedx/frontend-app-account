import { fireEvent, screen } from '@testing-library/react';

import EditableSelectField from '../EditableSelectField';
import { renderWithForm } from './renderWithForm';

jest.mock('../certificate-preference/CertificatePreference', () => function MockCertificatePreference() {
  return <div data-testid="certificate-preference" />;
});

const options = [
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
];

const renderComponent = (props = {}, form = {}) => renderWithForm(
  <EditableSelectField
    name="testField"
    label="Main Label"
    emptyLabel="Empty Main Label"
    type="select"
    value="defaultOption"
    options={options}
    helpText="Helpful Text"
    onSubmit={jest.fn()}
    onChange={jest.fn()}
    {...props}
  />,
  { form },
);

describe('EditableSelectField', () => {
  it('renders the selected option label and help text when not editing', () => {
    renderComponent();

    expect(screen.getByText('Main Label')).toBeInTheDocument();
    expect(screen.getByText('Default Option')).toBeInTheDocument();
    expect(screen.getByText('Helpful Text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('falls back to the empty label without a value', () => {
    renderComponent({ value: '' });
    expect(screen.getByRole('button', { name: 'Empty Main Label' })).toBeInTheDocument();
  });

  it('renders a select with grouped options when editing', () => {
    renderComponent({}, { openFormId: 'testField' });

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('defaultOption');
    expect(select.querySelectorAll('optgroup')).toHaveLength(2);
    expect(select.querySelectorAll('option')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders a flat list when no option has a group', () => {
    renderComponent({ options: [{ label: 'Default Option', value: 'defaultOption' }], value: 'defaultOption' }, { openFormId: 'testField' });

    const select = screen.getByRole('combobox');
    expect(select.querySelectorAll('optgroup')).toHaveLength(0);
    expect(select.querySelectorAll('option')).toHaveLength(1);
  });

  it('reports changes and submits the selected value', () => {
    const onChange = jest.fn();
    const onSubmit = jest.fn();
    renderComponent({ onChange, onSubmit }, { openFormId: 'testField' });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'suboption3' } });
    expect(onChange).toHaveBeenCalledWith('testField', 'suboption3');

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith('testField', 'defaultOption');
  });

  it('shows the error recorded for this field', () => {
    renderComponent({}, { openFormId: 'testField', errors: { testField: 'This is an error message' } });
    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('opens and closes its form through the form context', () => {
    const { form } = renderComponent({}, { openForm: jest.fn(), closeForm: jest.fn() });
    fireEvent.click(screen.getByRole('button', { name: /Edit/ }));
    expect(form.openForm).toHaveBeenCalledWith('testField');
  });
});
