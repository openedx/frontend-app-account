import { useQueryClient } from '@tanstack/react-query';
import {
  camelCaseObject, getAuthenticatedUser, Slot, snakeCaseObject,
} from '@openedx/frontend-base';

import { useAccountSettingsForm } from '@src/account-settings/data/FormContext';
import { useSettingsValues } from '@src/account-settings/data/hooks';
import { accountSettingsKeys } from '@src/account-settings/data/queryKeys';

import SwitchContent from '@src/account-settings/SwitchContent';

const AdditionalProfileFieldsSlot = () => {
  const queryClient = useQueryClient();
  const { data: values } = useSettingsValues();
  const { errors, saveSettings } = useAccountSettingsForm();

  // These reach the widgets as slot props; see the README for their contract.
  const slotProps = {
    refreshUserProfile: () => queryClient.invalidateQueries({
      queryKey: accountSettingsKeys.values(getAuthenticatedUser().username),
    }),
    updateUserProfile: (params: object) => saveSettings(null, null, snakeCaseObject(params)),
    profileFieldValues: camelCaseObject(values?.extended_profile),
    profileFieldErrors: errors,
    formComponents: {
      SwitchContent,
    },
  };

  return (
    <Slot
      id="org.openedx.frontend.slot.account.additionalProfileFields.v1"
      {...slotProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
