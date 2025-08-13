import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useDispatch, useSelector } from 'react-redux';
import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';

import { fetchSettings, saveSettings } from '../../account-settings/data/actions';

import SwitchContent from '../../account-settings/SwitchContent';

const AdditionalProfileFieldsSlot = () => {
  const dispatch = useDispatch();
  const extendedProfileValues = useSelector((state) => state.accountSettings.values.extended_profile);
  const errors = useSelector((state) => state.accountSettings.errors);

  const pluginProps = {
    refreshUserProfile: (username) => dispatch(fetchSettings(username)),
    updateUserProfile: (params) => dispatch(saveSettings(null, null, snakeCaseObject(params))),
    profileFieldValues: camelCaseObject(extendedProfileValues),
    profileFieldErrors: errors,
    formComponents: {
      SwitchContent,
    },
  };

  return (
    <PluginSlot
      id="org.openedx.frontend.account.additional_profile_fields.v1"
      pluginProps={pluginProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
