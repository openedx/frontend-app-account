import { useContext, useMemo } from 'react';
import { SiteContext, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Icon } from '@openedx/paragon';
import { CheckCircle, WarningFilled } from '@openedx/paragon/icons';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { useAccountSettingsForm } from '@src/account-settings/data/FormContext';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { COUNTRY_WITH_STATES, YEAR_OF_BIRTH_OPTIONS, getStatesList } from '@src/account-settings/data/constants';
import EditableField from '@src/account-settings/EditableField';
import EditableSelectField from '@src/account-settings/EditableSelectField';
import EmailField from '@src/account-settings/EmailField';
import ResetPassword from '@src/account-settings/reset-password';
import { getCountryList } from '@src/data/countries';
import {
  SelectOption, isCoppaComplianceEnabled, useFieldHandlers, useIsDisabledCountry, useStaticFields,
} from './hooks';

export const UsernameField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  return (
    <EditableField
      name="username"
      type="text"
      value={formValues.username}
      label={intl.formatMessage(messages['account.settings.field.username'])}
      helpText={intl.formatMessage(
        messages['account.settings.field.username.help.text'],
        { siteName: getSiteConfig().siteName },
      )}
      isEditable={false}
      {...handlers}
    />
  );
};

export const NameField = () => {
  const intl = useIntl();
  const {
    committedValues, formValues, verifiedName, verifiedNameHistory,
  } = useAccountSettingsData();
  const {
    drafts, updateDraft, saveSettings, saveMultipleSettings,
  } = useAccountSettingsForm();
  const { isEditable, emptyStaticFieldMessage } = useStaticFields();

  const renderHelpText = (status, proctoredExamId) => {
    if (!verifiedNameHistory) {
      return intl.formatMessage(messages['account.settings.field.full.name.help.text']);
    }

    let messageString = 'account.settings.field.full.name.help.text';

    if (status === 'submitted') {
      messageString += '.submitted';
      if (proctoredExamId) {
        messageString += '.proctored';
      }
    } else {
      messageString += '.default';
    }

    if (!committedValues.useVerifiedNameForCerts) {
      messageString += '.certificate';
    }

    return intl.formatMessage(messages[messageString]);
  };

  const handleSubmit = (formId, values) => {
    if (Object.keys(drafts).includes('useVerifiedNameForCerts')) {
      saveMultipleSettings([
        {
          formId,
          commitValues: values,
        },
        {
          formId: 'useVerifiedNameForCerts',
          commitValues: formValues.useVerifiedNameForCerts,
        },
      ], formId);
    } else {
      saveSettings(formId, values);
    }
  };

  return (
    <EditableField
      name="name"
      type="text"
      value={
        verifiedName?.status === 'submitted'
        && formValues.pending_name_change
          ? formValues.pending_name_change
          : formValues.name
      }
      label={intl.formatMessage(messages['account.settings.field.full.name'])}
      emptyLabel={
        isEditable('name')
          ? intl.formatMessage(messages['account.settings.field.full.name.empty'])
          : emptyStaticFieldMessage
      }
      helpText={
        verifiedName
          ? renderHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)
          : intl.formatMessage(messages['account.settings.field.full.name.help.text'])
      }
      isEditable={
        verifiedName
          ? isEditable('verifiedName') && isEditable('name')
          : isEditable('name')
      }
      isGrayedOut={
        verifiedName && !isEditable('verifiedName')
      }
      onChange={updateDraft}
      onSubmit={handleSubmit}
    />
  );
};

const renderVerifiedNameIcon = (status) => {
  switch (status) {
    case 'approved':
      return (<Icon src={CheckCircle} className="ml-1" style={{ height: '18px', width: '18px', color: 'green' }} />);
    case 'submitted':
      return (<Icon src={WarningFilled} className="ml-1" style={{ height: '18px', width: '18px', color: 'yellow' }} />);
    default:
      return null;
  }
};

export const VerifiedNameField = () => {
  const intl = useIntl();
  const { committedValues, formValues, verifiedName } = useAccountSettingsData();
  const {
    drafts, updateDraft, saveSettings, beginNameChange,
  } = useAccountSettingsForm();
  const { isEditable } = useStaticFields();

  if (!verifiedName) {
    return null;
  }

  const renderHelpText = (status, proctoredExamId) => {
    let messageStr = 'account.settings.field.name.verified.help.text';

    // add additional string based on status
    if (status === 'approved') {
      messageStr += '.verified';
    } else if (status === 'submitted') {
      messageStr += '.submitted';
    } else {
      return null;
    }

    // add additional string if verified name came from a proctored exam attempt
    if (proctoredExamId) {
      messageStr += '.proctored';
    }

    // add additional string based on certificate name use
    if (committedValues.useVerifiedNameForCerts) {
      messageStr += '.certificate';
    }

    return intl.formatMessage(messages[messageStr]);
  };

  const handleSubmit = (formId, values) => {
    if (Object.keys(drafts).includes('useVerifiedNameForCerts')) {
      saveSettings('useVerifiedNameForCerts', formValues.useVerifiedNameForCerts);
    }
    if (values !== committedValues?.verified_name) {
      beginNameChange(formId);
    } else {
      saveSettings(formId, values);
    }
  };

  return (
    <EditableField
      name="verified_name"
      type="text"
      value={formValues.verified_name}
      label={
        (
          <div className="d-flex">
            {intl.formatMessage(messages['account.settings.field.name.verified'])}
            {renderVerifiedNameIcon(verifiedName.status)}
          </div>
        )
      }
      helpText={renderHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)}
      isEditable={isEditable('verifiedName')}
      isGrayedOut={!isEditable('verifiedName')}
      onChange={updateDraft}
      onSubmit={handleSubmit}
    />
  );
};

export const EmailAddressField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const { isEditable, emptyStaticFieldMessage } = useStaticFields();
  const handlers = useFieldHandlers();

  return (
    <EmailField
      name="email"
      label={intl.formatMessage(messages['account.settings.field.email'])}
      emptyLabel={
        isEditable('email')
          ? intl.formatMessage(messages['account.settings.field.email.empty'])
          : emptyStaticFieldMessage
      }
      value={formValues.email}
      confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
      helpText={intl.formatMessage(
        messages['account.settings.field.email.help.text'],
        { siteName: getSiteConfig().siteName },
      )}
      isEditable={isEditable('email')}
      {...handlers}
    />
  );
};

export const SecondaryEmailField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  if (!formValues.secondary_email_enabled) {
    return null;
  }

  return (
    <EmailField
      name="secondary_email"
      label={intl.formatMessage(messages['account.settings.field.secondary.email'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.secondary.email.empty'])}
      value={formValues.secondary_email}
      confirmationMessageDefinition={messages['account.settings.field.secondary.email.confirmation']}
      {...handlers}
    />
  );
};

export const ResetPasswordField = () => {
  const { formValues } = useAccountSettingsData();
  return <ResetPassword email={formValues.email} />;
};

export const YearOfBirthField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  if (isCoppaComplianceEnabled()) {
    return null;
  }

  const options: SelectOption[] = [{
    value: '',
    label: intl.formatMessage(messages['account.settings.field.year_of_birth.options.empty']),
  }, ...YEAR_OF_BIRTH_OPTIONS];

  return (
    <EditableSelectField
      name="year_of_birth"
      type="select"
      label={intl.formatMessage(messages['account.settings.field.dob'])}
      emptyLabel={intl.formatMessage(messages['account.settings.field.dob.empty'])}
      value={formValues.year_of_birth}
      options={options}
      {...handlers}
    />
  );
};

export const CountryField = () => {
  const intl = useIntl();
  const { locale } = useContext(SiteContext);
  const { committedValues, formValues, countriesCodesList } = useAccountSettingsData();
  const { isEditable, emptyStaticFieldMessage } = useStaticFields();
  const isDisabledCountry = useIsDisabledCountry();

  const options = useMemo(() => {
    const countries = getCountryList(locale).map(({ code, name }) => ({
      value: code,
      label: name,
      disabled: isDisabledCountry(code),
    }));
    // Keep the learner's saved country even when it is no longer allowed.
    const allowed = countriesCodesList.length
      ? countries.filter(({ value }) => value === committedValues?.country || countriesCodesList.includes(value))
      : countries;
    return [{
      value: '',
      label: intl.formatMessage(messages['account.settings.field.country.options.empty']),
    }].concat(allowed);
  }, [intl, locale, countriesCodesList, committedValues?.country, isDisabledCountry]);
  const handlers = useFieldHandlers();

  return (
    <EditableSelectField
      name="country"
      type="select"
      value={formValues.country}
      options={options}
      label={intl.formatMessage(messages['account.settings.field.country'])}
      emptyLabel={
        isEditable('country')
          ? intl.formatMessage(messages['account.settings.field.country.empty'])
          : emptyStaticFieldMessage
      }
      isEditable={isEditable('country')}
      {...handlers}
    />
  );
};

export const StateField = () => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const { isEditable, emptyStaticFieldMessage } = useStaticFields();
  const isDisabledCountry = useIsDisabledCountry();
  const handlers = useFieldHandlers();

  // Show State field only if the country is US (could include Canada later)
  const { country } = formValues;
  if (country !== COUNTRY_WITH_STATES || isDisabledCountry(country)) {
    return null;
  }

  return (
    <EditableSelectField
      name="state"
      type="select"
      value={formValues.state}
      options={[{
        value: '',
        label: intl.formatMessage(messages['account.settings.field.state.options.empty']),
      }].concat(getStatesList(country))}
      label={intl.formatMessage(messages['account.settings.field.state'])}
      emptyLabel={
        isEditable('state')
          ? intl.formatMessage(messages['account.settings.field.state.empty'])
          : emptyStaticFieldMessage
      }
      isEditable={isEditable('state')}
      {...handlers}
    />
  );
};
