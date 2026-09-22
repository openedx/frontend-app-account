import { fireEvent, screen } from '@testing-library/react';
import { mergeSiteConfig, useSlotContext, WidgetOperationTypes } from '@openedx/frontend-base';

import { accountSettingsKeys } from '../../account-settings/data/queryKeys';
import { renderWithForm } from '../../account-settings/test/renderWithForm';
import AdditionalProfileFieldsSlot from '.';

jest.mock('../../account-settings/data/hooks', () => ({
  useSettingsValues: () => ({
    data: { extended_profile: [{ field_name: 'favorite_color', field_value: 'blue' }] },
  }),
}));

// A widget standing in for an operator's custom field, exercising every slot prop.
const Probe = () => {
  const context = useSlotContext();
  const updateUserProfile = context.updateUserProfile as (params: object) => void;
  const refreshUserProfile = context.refreshUserProfile as () => void;

  return (
    <>
      <div data-testid="values">{JSON.stringify(context.profileFieldValues)}</div>
      <div data-testid="errors">{JSON.stringify(context.profileFieldErrors)}</div>
      <button
        type="button"
        onClick={() => updateUserProfile({ extendedProfile: [{ fieldName: 'favorite_color', fieldValue: 'red' }] })}
      >
        update
      </button>
      <button type="button" onClick={() => refreshUserProfile()}>refresh</button>
    </>
  );
};

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.accountTest',
    slots: [{
      slotId: 'org.openedx.frontend.slot.account.additionalProfileFields.v1',
      id: 'org.openedx.frontend.widget.accountTest.probe',
      op: WidgetOperationTypes.APPEND,
      component: Probe,
    }],
  }],
});

describe('AdditionalProfileFieldsSlot', () => {
  it('hands widgets the extended profile in camel case, with the field errors', () => {
    renderWithForm(<AdditionalProfileFieldsSlot />, { form: { errors: { favorite_color: 'Not a color' } } });

    expect(screen.getByTestId('values')).toHaveTextContent('[{"fieldName":"favorite_color","fieldValue":"blue"}]');
    expect(screen.getByTestId('errors')).toHaveTextContent('{"favorite_color":"Not a color"}');
  });

  it('saves a widget\'s update as an extended profile change', () => {
    const { form } = renderWithForm(<AdditionalProfileFieldsSlot />, { form: { saveSettings: jest.fn() } });

    fireEvent.click(screen.getByRole('button', { name: 'update' }));

    expect(form.saveSettings).toHaveBeenCalledWith(null, null, {
      extended_profile: [{ field_name: 'favorite_color', field_value: 'red' }],
    });
  });

  it('refreshes the settings on request', () => {
    const { queryClient } = renderWithForm(<AdditionalProfileFieldsSlot />);
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: accountSettingsKeys.values('Mock User') });
  });
});
