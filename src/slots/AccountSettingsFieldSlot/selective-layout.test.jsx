import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutOperationTypes, mergeSiteConfig, WidgetOperationTypes } from '@openedx/frontend-base';
import EditableField from '@src/account-settings/EditableField';
import { renderWithForm } from '@src/account-settings/test/renderWithForm';
import SelectiveFieldLayout from './example/SelectiveFieldLayout';

const Extra = () => <span>Additional widget</span>;

mergeSiteConfig({ apps: [{ appId: 'org.openedx.frontend.app.selectiveFieldTest', slots: [
  { slotId: 'org.openedx.frontend.slot.account.settingsField.v1', op: LayoutOperationTypes.REPLACE, component: SelectiveFieldLayout },
  { slotId: 'org.openedx.frontend.slot.account.settingsField.v1', id: 'extra', op: WidgetOperationTypes.APPEND, component: Extra },
] }] });

const field = (name, label) => <EditableField name={name} label={label} type="text" value="example" onChange={jest.fn()} onSubmit={jest.fn()} />;

it('decorates, hides, and replaces selected fields while preserving other content', async () => {
  const user = userEvent.setup();
  const openForm = jest.fn();
  renderWithForm(<>{field('year_of_birth', 'Year')}{field('social_link_x', 'X link')}{field('time_zone', 'Time zone')}{field('username', 'Username')}</>, { form: { openForm } });
  expect(screen.getByText('Why do we ask for your year of birth?')).toBeInTheDocument();
  expect(screen.queryByText('X link')).not.toBeInTheDocument();
  expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getAllByText('Additional widget')).toHaveLength(3);
  const editButtons = screen.getAllByRole('button', { name: /edit/i });
  expect(editButtons).toHaveLength(2);
  await user.click(editButtons[1]);
  expect(openForm).toHaveBeenCalledWith('username');
});
