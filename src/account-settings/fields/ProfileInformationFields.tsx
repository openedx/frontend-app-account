import { useContext } from 'react';
import { SiteContext, useIntl } from '@openedx/frontend-base';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { EDUCATION_LEVELS, GENDER_OPTIONS, WORK_EXPERIENCE_OPTIONS } from '@src/account-settings/data/constants';
import EditableSelectField from '@src/account-settings/EditableSelectField';
import { getLanguageList } from '@src/data/languages';
import { isCoppaComplianceEnabled, useFieldHandlers } from './hooks';

export const LevelOfEducationField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  const options = EDUCATION_LEVELS.map(key => ({
    value: key,
    label: intl.formatMessage(messages[`account.settings.field.education.levels.${key || 'empty'}`]),
  }));

  return (
    <EditableSelectField
      name="level_of_education"
      type="select"
      value={formValues.level_of_education}
      options={isCoppaComplianceEnabled() ? options.filter(option => option.value !== 'el') : options}
      label={intl.formatMessage(messages['account.settings.field.education'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.education.empty'])}
      {...handlers}
    />
  );
};

export const GenderField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  return (
    <EditableSelectField
      name="gender"
      type="select"
      value={formValues.gender}
      options={GENDER_OPTIONS.map(key => ({
        value: key,
        label: intl.formatMessage(messages[`account.settings.field.gender.options.${key || 'empty'}`]),
      }))}
      label={intl.formatMessage(messages['account.settings.field.gender'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.gender.empty'])}
      {...handlers}
    />
  );
};

export const WorkExperienceField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  const workExperience = formValues?.extended_profile?.find(field => field.field_name === 'work_experience');
  if (!workExperience) {
    return null;
  }

  return (
    <EditableSelectField
      name="work_experience"
      type="select"
      value={workExperience.field_value}
      options={WORK_EXPERIENCE_OPTIONS.map(key => ({
        value: key,
        label: key === '' ? intl.formatMessage(messages['account.settings.field.work.experience.options.empty']) : key,
      }))}
      label={intl.formatMessage(messages['account.settings.field.work.experience'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.work.experience.empty'])}
      {...handlers}
    />
  );
};

export const LanguageProficienciesField = () => {
  const intl = useIntl();
  const { locale } = useContext(SiteContext);
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  return (
    <EditableSelectField
      name="language_proficiencies"
      type="select"
      value={formValues.language_proficiencies}
      options={[{
        value: '',
        label: intl.formatMessage(messages['account.settings.field.language_proficiencies.options.empty']),
      }].concat(getLanguageList(locale).map(({ code, name }) => ({ value: code, label: name })))}
      label={intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
      {...handlers}
    />
  );
};
