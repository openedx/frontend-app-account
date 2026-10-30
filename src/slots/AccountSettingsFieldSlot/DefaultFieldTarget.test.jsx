import { renderWithForm } from '@src/account-settings/test/renderWithForm';
import EditableField from '@src/account-settings/EditableField';

it('does not add a targeting container without a custom layout', () => {
  const { container, getByText } = renderWithForm(
    <EditableField name="username" label="Username" type="text" value="alice" onChange={jest.fn()} onSubmit={jest.fn()} />,
  );
  expect(getByText('alice')).toBeInTheDocument();
  expect(container.querySelector('[data-account-settings-field]')).not.toBeInTheDocument();
});
