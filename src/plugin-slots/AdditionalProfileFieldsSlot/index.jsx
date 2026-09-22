import { useQueryClient } from '@tanstack/react-query';
import {
  camelCaseObject, getAuthenticatedUser, Slot, snakeCaseObject,
} from '@openedx/frontend-base';

import { useAccountSettingsForm } from '../../account-settings/data/FormContext';
import { useSettingsValues } from '../../account-settings/data/hooks';
import { accountSettingsKeys } from '../../account-settings/data/queryKeys';

import SwitchContent from '../../account-settings/SwitchContent';

const AdditionalProfileFieldsSlot = () => {
  const queryClient = useQueryClient();
  const { data: values } = useSettingsValues();
  const { errors, saveSettings } = useAccountSettingsForm();

  const slotProps = {
    refreshUserProfile: () => queryClient.invalidateQueries({
      queryKey: accountSettingsKeys.values(getAuthenticatedUser().username),
    }),
    updateUserProfile: (params) => saveSettings(null, null, snakeCaseObject(params)),
    profileFieldValues: camelCaseObject(values?.extended_profile),
    profileFieldErrors: errors,
    formComponents: {
      SwitchContent,
    },
  };

  return (
    <Slot
      id="org.openedx.frontend.account.additional_profile_fields.v1"
      {...slotProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
