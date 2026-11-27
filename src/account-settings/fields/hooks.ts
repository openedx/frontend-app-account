import { useCallback } from 'react';
import { getAppConfig, useIntl } from '@openedx/frontend-base';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { useAccountSettingsForm } from '@src/account-settings/data/FormContext';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { FIELD_LABELS } from '@src/account-settings/data/constants';
import { appId } from '@src/constants';
import { parseEnvBoolean } from '@src/utils';

export interface SelectOption {
  value: string | number;
  label: string | number;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  group: SelectOption[];
}

interface ExtendedProfileField {
  field_name: string;
  field_value: unknown;
}

/**
 * With COPPA compliance on, the year of birth is collected by the DOB form and the youngest
 * education level is not offered.
 */
export const isCoppaComplianceEnabled = () => parseEnvBoolean(
  String(getAppConfig(appId).ENABLE_COPPA_COMPLIANCE ?? ''),
);

/**
 * Whether a country is outside the list the platform allows learners to choose.
 */
export const useIsDisabledCountry = () => {
  const { countriesCodesList } = useAccountSettingsData();
  return useCallback(
    (country: string) => countriesCodesList.length > 0 && !countriesCodesList.find(x => x === country),
    [countriesCodesList],
  );
};

/**
 * The `onChange` and `onSubmit` handlers most fields share: drafts go to the form, and saves go
 * through `saveSettings`, nested under `extended_profile` for extended profile fields.
 */
export const useFieldHandlers = () => {
  const { formValues } = useAccountSettingsData();
  const { updateDraft, saveSettings } = useAccountSettingsForm();
  const isDisabledCountry = useIsDisabledCountry();

  const onSubmit = (formId: string, values: unknown) => {
    if (formId === FIELD_LABELS.COUNTRY && isDisabledCountry(values as string)) {
      return;
    }

    let extendedProfileObject = {};
    const extendedProfile = formValues.extended_profile as ExtendedProfileField[] | undefined;

    if (extendedProfile?.some((field) => field.field_name === formId)) {
      extendedProfileObject = {
        extended_profile: extendedProfile.map(field => (field.field_name === formId
          ? { ...field, field_value: values }
          : field)),
      };
    }
    saveSettings(formId, values, extendedProfileObject);
  };

  return { onChange: updateDraft, onSubmit };
};

/**
 * Which fields the learner may edit, and the empty label for those they may not. Enterprise
 * customer profiles are managed by their organizations, who are named in that label.
 */
export const useStaticFields = () => {
  const intl = useIntl();
  const { staticFields, profileDataManager } = useAccountSettingsData();

  const isEditable = (fieldName: string) => !staticFields.includes(fieldName);
  const emptyStaticFieldMessage = profileDataManager
    ? intl.formatMessage(messages['account.settings.static.field.empty'], { enterprise: profileDataManager })
    : intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);

  return { isEditable, emptyStaticFieldMessage };
};
