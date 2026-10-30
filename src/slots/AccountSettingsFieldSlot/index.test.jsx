import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mergeSiteConfig, useSlotContext, WidgetOperationTypes } from '@openedx/frontend-base';
import EditableField from '@src/account-settings/EditableField';
import EditableSelectField from '@src/account-settings/EditableSelectField';
import EmailField from '@src/account-settings/EmailField';
import { renderWithForm } from '@src/account-settings/test/renderWithForm';
import FieldHint from './example';

const Probe = () => {
  const { fieldName, value } = useSlotContext();
  return <output data-testid={`context-${fieldName}`}>{JSON.stringify(value)}</output>;
};

mergeSiteConfig({ apps: [{ appId: 'org.openedx.frontend.app.fieldTest', slots: [
  { slotId: 'org.openedx.frontend.slot.account.settingsField.v1', id: 'probe', op: WidgetOperationTypes.APPEND, component: Probe },
  { slotId: 'org.openedx.frontend.slot.account.settingsField.v1', id: 'hint', op: WidgetOperationTypes.APPEND, component: FieldHint },
] }] });

const fields = year => (
  <>
    <EditableField name="username" label="Username" type="text" value="alice" onChange={jest.fn()} onSubmit={jest.fn()} />
    <EditableSelectField name="year_of_birth" label="Year" type="select" value={year} options={[{ value: 2000, label: '2000' }]} onChange={jest.fn()} onSubmit={jest.fn()} />
    <EmailField name="email" label="Email" value="" onChange={jest.fn()} onSubmit={jest.fn()} />
  </>
);

it('exposes each field value and adds a hint only to the selected field', () => {
  const { rerender } = renderWithForm(fields(2000));
  expect(screen.getByText('alice')).toBeInTheDocument();
  expect(screen.getByTestId('context-username')).toHaveTextContent('"alice"');
  expect(screen.getByTestId('context-year_of_birth')).toHaveTextContent('2000');
  expect(screen.getByTestId('context-email')).toHaveTextContent('""');
  expect(screen.getAllByText('Some courses have age requirements.')).toHaveLength(1);
  rerender(fields(2001));
  expect(screen.getByTestId('context-year_of_birth')).toHaveTextContent('2001');
});

it('keeps email editing and cancellation working without leaking slot context to the input', async () => {
  const user = userEvent.setup();
  const closeForm = jest.fn();
  renderWithForm(fields(2000), { form: { openFormId: 'email', closeForm, errors: { email: 'Invalid email' } } });
  const input = screen.getByLabelText('Email');
  expect(input).not.toHaveAttribute('fieldName');
  expect(input).not.toHaveAttribute('fieldname');
  expect(input).toHaveValue('');
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /cancel/i }));
  expect(closeForm).toHaveBeenCalledWith('email');
});

it('submits an edited email through the existing handler', async () => {
  const user = userEvent.setup();
  const submit = jest.fn();
  renderWithForm(
    <EmailField name="email" label="Email" value="alice@example.com" onChange={jest.fn()} onSubmit={submit} />,
    { form: { openFormId: 'email' } },
  );
  await user.click(screen.getByRole('button', { name: /save/i }));
  expect(submit).toHaveBeenCalledWith('email', 'alice@example.com');
});
