import { useState } from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutOperationTypes, mergeSiteConfig } from '@openedx/frontend-base';
import EditableField from '@src/account-settings/EditableField';
import { createFormContextValue, renderWithForm } from '@src/account-settings/test/renderWithForm';
import { AccountSettingsFormContext } from '@src/account-settings/data/FormContext';
import { renderWithProviders } from '@src/tests/renderWithProviders';
import FieldTargetLayout from './example/FieldTargetLayout';

mergeSiteConfig({ apps: [{ appId: 'org.openedx.frontend.app.fieldTargetTest', slots: [{
  slotId: 'org.openedx.frontend.slot.account.settingsField.v1',
  op: LayoutOperationTypes.REPLACE,
  component: FieldTargetLayout,
}] }] });

const fields = () => (
  <>
    <EditableField name="username" label="Username" type="text" value="alice" onChange={jest.fn()} onSubmit={jest.fn()} />
    <EditableField name="country" label="Country" type="text" value="Australia" onChange={jest.fn()} onSubmit={jest.fn()} />
  </>
);

const InteractiveFields = () => {
  const [openFormId, setOpenFormId] = useState(null);
  const form = createFormContextValue({ openFormId, openForm: setOpenFormId, closeForm: () => setOpenFormId(null) });
  return <AccountSettingsFormContext.Provider value={form}>{fields()}</AccountSettingsFormContext.Provider>;
};

it('exposes a distinct target for each field and keeps editing controls inside that target', async () => {
  const user = userEvent.setup();
  const openForm = jest.fn();
  const view = renderWithForm(fields(), { form: { openForm, openFormId: 'country' } });
  const username = view.container.querySelector('[data-account-settings-field="username"]');
  const country = view.container.querySelector('[data-account-settings-field="country"]');
  expect(username).toBeInTheDocument();
  expect(country).toBeInTheDocument();
  expect(within(username).getByText('alice')).toBeInTheDocument();
  expect(within(country).getByLabelText('Country')).toHaveValue('Australia');
  await user.click(within(username).getByRole('button', { name: /edit/i }));
  expect(openForm).toHaveBeenCalledWith('username');
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});

it('keeps the same field target when the field transitions into editing', async () => {
  const user = userEvent.setup();
  const view = renderWithProviders(<InteractiveFields />);
  const before = view.container.querySelector('[data-account-settings-field="username"]');
  await user.click(within(before).getByRole('button', { name: /edit/i }));
  const after = view.container.querySelector('[data-account-settings-field="username"]');
  expect(after).toBe(before);
  expect(within(after).getByLabelText('Username')).toHaveValue('alice');
  await user.click(within(after).getByRole('button', { name: /cancel/i }));
  expect(within(after).getByText('alice')).toBeInTheDocument();
});
