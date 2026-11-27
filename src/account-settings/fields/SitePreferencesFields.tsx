import { useContext, useMemo } from 'react';
import { SiteContext, useIntl } from '@openedx/frontend-base';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { useAccountSettingsForm } from '@src/account-settings/data/FormContext';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import EditableSelectField from '@src/account-settings/EditableSelectField';
import { SelectOption, SelectOptionGroup, useFieldHandlers } from './hooks';

export const SiteLanguageField = () => {
  const intl = useIntl();
  const { locale } = useContext(SiteContext);
  const { siteLanguageOptions } = useAccountSettingsData();
  const { drafts } = useAccountSettingsForm();
  const handlers = useFieldHandlers();

  return (
    <EditableSelectField
      name="siteLanguage"
      type="select"
      options={siteLanguageOptions}
      value={drafts.siteLanguage !== undefined ? drafts.siteLanguage as string : locale}
      label={intl.formatMessage(messages['account.settings.field.site.language'])}
      helpText={intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
      {...handlers}
    />
  );
};

export const TimeZoneField = () => {
  const intl = useIntl();
  const { formValues, timeZoneOptions, countryTimeZoneOptions } = useAccountSettingsData();
  const { onChange, onSubmit } = useFieldHandlers();

  const options = useMemo(() => {
    const grouped: (SelectOption | SelectOptionGroup)[] = [{
      label: intl.formatMessage(messages['account.settings.field.time.zone.default']),
      value: '',
    }];
    if (countryTimeZoneOptions.length) {
      grouped.push({
        label: intl.formatMessage(messages['account.settings.field.time.zone.country']),
        group: countryTimeZoneOptions,
      });
    }
    grouped.push({
      label: intl.formatMessage(messages['account.settings.field.time.zone.all']),
      group: timeZoneOptions,
    });
    return grouped;
  }, [intl, timeZoneOptions, countryTimeZoneOptions]);

  return (
    <EditableSelectField
      name="time_zone"
      type="select"
      value={formValues.time_zone}
      options={options}
      label={intl.formatMessage(messages['account.settings.field.time.zone'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.time.zone.empty'])}
      helpText={intl.formatMessage(messages['account.settings.field.time.zone.description'])}
      onChange={onChange}
      // the endpoint will not accept an empty string. it must be null
      onSubmit={(formId, value) => onSubmit(formId, value || null)}
    />
  );
};
