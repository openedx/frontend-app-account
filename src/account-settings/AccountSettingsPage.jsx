import React, {
  useCallback, useContext, useEffect, useMemo, useRef,
} from 'react';
import {
  SiteContext,
  sendTrackingLogEvent,
  useIntl,
  FormattedMessage,
  getSiteConfig,
  getAppConfig,
} from '@openedx/frontend-base';

import findIndex from 'lodash.findindex';
import { Hyperlink, Icon, Alert } from '@openedx/paragon';
import { CheckCircle, Error, WarningFilled } from '@openedx/paragon/icons';

import messages from './AccountSettingsPage.messages';
import { AccountSettingsFormProvider, useAccountSettingsForm } from './data/FormContext';
import { useAccountSettingsData } from './data/hooks';
import PageLoading from './PageLoading';
import JumpNav from './JumpNav';
import DeleteAccount from './delete-account';
import EditableField from './EditableField';
import EditableSelectField from './EditableSelectField';
import ResetPassword from './reset-password';
import NameChange from './name-change';
import ThirdPartyAuth from './third-party-auth';
import EmailField from './EmailField';
import OneTimeDismissibleAlert from './OneTimeDismissibleAlert';
import DOBModal from './DOBForm';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
  COUNTRY_WITH_STATES,
  COPPA_COMPLIANCE_YEAR,
  WORK_EXPERIENCE_OPTIONS,
  getStatesList,
  FIELD_LABELS,
} from './data/constants';
import NotificationSettings from '../notification-preferences/NotificationSettings';
import AdditionalProfileFieldsSlot from '../slots/AdditionalProfileFieldsSlot';
import { appId } from '../constants';
import { getCountryList } from '../data/countries';
import { getLanguageList } from '../data/languages';
import { parseEnvArray, parseEnvBoolean } from '../utils';

const NAV_LINK_IDS = [
  '#basic-information',
  '#profile-information',
  '#social-media',
  '#notifications',
  '#site-preferences',
  '#linked-accounts',
  '#delete-account',
];

const AccountSettingsPageContent = () => {
  const intl = useIntl();
  const { locale, authenticatedUser } = useContext(SiteContext);
  const {
    isPending,
    isError,
    committedValues,
    formValues,
    verifiedName,
    mostRecentVerifiedName,
    verifiedNameHistory,
    staticFields,
    profileDataManager,
    timeZoneOptions,
    countryTimeZoneOptions,
    tpaProviders,
    thirdPartyAuthError,
    countriesCodesList,
    isActive,
    siteLanguageOptions,
  } = useAccountSettingsData();
  const {
    drafts,
    nameChangeModal,
    updateDraft,
    saveSettings,
    saveMultipleSettings,
    beginNameChange,
  } = useAccountSettingsForm();

  const navLinkRefs = useRef(Object.fromEntries(NAV_LINK_IDS.map(id => [id, React.createRef()])));
  const loaded = !isPending && !isError;
  const wasLoaded = useRef(false);

  useEffect(() => {
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: authenticatedUser.userId,
    });
  }, [authenticatedUser.userId]);

  useEffect(() => {
    if (!loaded || wasLoaded.current) {
      return;
    }
    wasLoaded.current = true;

    // Check for the locationHash in the URL and then scroll to it if it is in the NavLinks list
    const locationHash = global.location.hash;
    if (typeof locationHash !== 'string') {
      return;
    }
    const ref = navLinkRefs.current[locationHash];
    if (ref && ref.current) {
      window.scrollTo(0, ref.current.offsetTop);
    }
  }, [loaded]);

  const isDisabledCountry = useCallback(
    (country) => countriesCodesList.length > 0 && !countriesCodesList.find(x => x === country),
    [countriesCodesList],
  );

  const removeDisabledCountries = useCallback((countryList) => {
    const committedCountry = committedValues?.country;

    if (!countriesCodesList.length) {
      return countryList;
    }
    return countryList.filter(({ value }) => value === committedCountry || countriesCodesList.find(x => x === value));
  }, [countriesCodesList, committedValues?.country]);

  const localizedTimeZoneOptions = useMemo(() => {
    const concatTimeZoneOptions = [{
      label: intl.formatMessage(messages['account.settings.field.time.zone.default']),
      value: '',
    }];
    if (countryTimeZoneOptions.length) {
      concatTimeZoneOptions.push({
        label: intl.formatMessage(messages['account.settings.field.time.zone.country']),
        group: countryTimeZoneOptions,
      });
    }
    concatTimeZoneOptions.push({
      label: intl.formatMessage(messages['account.settings.field.time.zone.all']),
      group: timeZoneOptions,
    });
    return concatTimeZoneOptions;
  }, [intl, timeZoneOptions, countryTimeZoneOptions]);

  const localizedOptions = useMemo(() => ({
    countryOptions: [{
      value: '',
      label: intl.formatMessage(messages['account.settings.field.country.options.empty']),
    }].concat(
      removeDisabledCountries(
        getCountryList(locale).map(({ code, name }) => ({
          value: code,
          label: name,
          disabled: isDisabledCountry(code),
        })),
      ),
    ),
    stateOptions: [{
      value: '',
      label: intl.formatMessage(messages['account.settings.field.state.options.empty']),
    }].concat(getStatesList(formValues.country)),
    languageProficiencyOptions: [{
      value: '',
      label: intl.formatMessage(messages['account.settings.field.language_proficiencies.options.empty']),
    }].concat(getLanguageList(locale).map(({ code, name }) => ({ value: code, label: name }))),
    yearOfBirthOptions: [{
      value: '',
      label: intl.formatMessage(messages['account.settings.field.year_of_birth.options.empty']),
    }].concat(YEAR_OF_BIRTH_OPTIONS),
    educationLevelOptions: EDUCATION_LEVELS.map(key => ({
      value: key,
      label: intl.formatMessage(messages[`account.settings.field.education.levels.${key || 'empty'}`]),
    })),
    genderOptions: GENDER_OPTIONS.map(key => ({
      value: key,
      label: intl.formatMessage(messages[`account.settings.field.gender.options.${key || 'empty'}`]),
    })),
    workExperienceOptions: WORK_EXPERIENCE_OPTIONS.map(key => ({
      value: key,
      label: key === '' ? intl.formatMessage(messages['account.settings.field.work.experience.options.empty']) : key,
    })),
  }), [intl, locale, formValues.country, removeDisabledCountries, isDisabledCountry]);

  const canDeleteAccount = () => (
    !parseEnvArray(getAppConfig(appId).COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED).includes(committedValues.country)
  );

  const handleEditableFieldChange = (name, value) => {
    updateDraft(name, value);
  };

  const handleSubmit = (formId, values) => {
    if (formId === FIELD_LABELS.COUNTRY && isDisabledCountry(values)) {
      return;
    }

    let extendedProfileObject = {};

    if ('extended_profile' in formValues && formValues.extended_profile.some((field) => field.field_name === formId)) {
      extendedProfileObject = {
        extended_profile: formValues.extended_profile.map(field => (field.field_name === formId
          ? { ...field, field_value: values }
          : field)),
      };
    }
    saveSettings(formId, values, extendedProfileObject);
  };

  const handleSubmitProfileName = (formId, values) => {
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

  const handleSubmitVerifiedName = (formId, values) => {
    if (Object.keys(drafts).includes('useVerifiedNameForCerts')) {
      saveSettings('useVerifiedNameForCerts', formValues.useVerifiedNameForCerts);
    }
    if (values !== committedValues?.verified_name) {
      beginNameChange(formId);
    } else {
      saveSettings(formId, values);
    }
  };

  const isEditable = (fieldName) => !staticFields.includes(fieldName);

  // Enterprise customer profiles are managed by their organizations. We determine whether
  // a profile is managed or not by the presence of the profileDataManager prop.
  const isManagedProfile = () => Boolean(profileDataManager);

  const renderThirdPartyAuthErrorMessage = () => {
    if (!thirdPartyAuthError) {
      return null;
    }

    // The LMS records a message when a third-party auth attempt fails (for instance, when the
    // provider account the user tried to link is already linked to another account) and exposes it
    // through the third_party_auth_error endpoint. The message is already localized and consumed on
    // read, so it is only displayed once.
    return (
      <div>
        <Alert variant="danger" icon={Error}>
          {thirdPartyAuthError}
        </Alert>
      </div>
    );
  };

  const renderManagedProfileMessage = () => {
    if (!isManagedProfile()) {
      return null;
    }

    return (
      <div>
        <Alert variant="info">
          <FormattedMessage
            id="account.settings.message.managed.settings"
            defaultMessage="Your profile settings are managed by {managerTitle}. Contact your administrator or {support} for help."
            description="alert message informing the user their account data is managed by a third party"
            values={{
              managerTitle: <b>{profileDataManager}</b>,
              support: (
                <Hyperlink destination={getAppConfig(appId).SUPPORT_URL} target="_blank">
                  <FormattedMessage
                    id="account.settings.message.managed.settings.support"
                    defaultMessage="support"
                    description="website support"
                  />
                </Hyperlink>
              ),
            }}
          />
        </Alert>
      </div>
    );
  };

  const renderFullNameHelpText = (status, proctoredExamId) => {
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

  const renderVerifiedNameSuccessMessage = (verifiedNameValue, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameSuccessMessage-${verifiedNameValue}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="success"
        icon={CheckCircle}
        header={intl.formatMessage(messages['account.settings.field.name.verified.success.message.header'])}
        body={intl.formatMessage(messages['account.settings.field.name.verified.success.message'])}
      />
    );
  };

  const renderVerifiedNameFailureMessage = (verifiedNameValue, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameFailureMessage-${verifiedNameValue}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="danger"
        icon={Error}
        header={intl.formatMessage(messages['account.settings.field.name.verified.failure.message.header'])}
        body={
          (
            <div className="d-flex flex-row">
              {intl.formatMessage(messages['account.settings.field.name.verified.failure.message'])}
            </div>
          )
        }
      />
    );
  };

  const renderVerifiedNameSubmittedMessage = (willCertNameChange) => (
    <Alert
      variant="warning"
      icon={WarningFilled}
    >
      <Alert.Heading>
        {intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.header'])}
      </Alert.Heading>
      <p>
        {intl.formatMessage(messages['account.settings.field.name.verified.submitted.message'])}{' '}
        {
          willCertNameChange
          && intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.certificate'])
        }
      </p>
    </Alert>
  );

  const renderVerifiedNameMessage = (verifiedNameRecord) => {
    const {
      created,
      status,
      profile_name: profileName,
      verified_name: verifiedNameValue,
      proctored_exam_attempt_id: proctoredExamId,
    } = verifiedNameRecord;
    let willCertNameChange = false;

    if (
      (
        // User submitted a profile name change, and uses their profile name on certificates
        committedValues.name !== profileName
        && !committedValues.useVerifiedNameForCerts
      )
      || (
        // User submitted a verified name change, and uses their verified name on certificates
        committedValues.name === profileName
        && committedValues.useVerifiedNameForCerts
      )
    ) {
      willCertNameChange = true;
    }

    if (proctoredExamId) {
      return null;
    }

    switch (status) {
      case 'approved':
        return renderVerifiedNameSuccessMessage(verifiedNameValue, created);
      case 'denied':
        return renderVerifiedNameFailureMessage(verifiedNameValue, created);
      case 'submitted':
        return renderVerifiedNameSubmittedMessage(willCertNameChange);
      default:
        return null;
    }
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

  const renderVerifiedNameHelpText = (status, proctoredExamId) => {
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

  const renderEmptyStaticFieldMessage = () => {
    if (isManagedProfile()) {
      return intl.formatMessage(messages['account.settings.static.field.empty'], {
        enterprise: profileDataManager,
      });
    }
    return intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);
  };

  const renderNameChangeModal = () => {
    if (nameChangeModal && nameChangeModal.formId) {
      return <NameChange targetFormId={nameChangeModal.formId} />;
    }
    return null;
  };

  const renderSecondaryEmailField = (editableFieldProps) => {
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
        {...editableFieldProps}
      />
    );
  };

  const renderContent = () => {
    const editableFieldProps = {
      onChange: handleEditableFieldChange,
      onSubmit: handleSubmit,
    };

    const {
      countryOptions,
      stateOptions,
      languageProficiencyOptions,
      yearOfBirthOptions,
      educationLevelOptions,
      genderOptions,
      workExperienceOptions,
    } = localizedOptions;

    // Show State field only if the country is US (could include Canada later)
    const { country } = formValues;
    const showState = country === COUNTRY_WITH_STATES && !isDisabledCountry(country);

    const hasWorkExperience = !!formValues?.extended_profile?.find(field => field.field_name === 'work_experience');

    const hasLinkedTPA = findIndex(tpaProviders, provider => provider.connected) >= 0;

    // if user is under 13 and does not have cookie set
    const {
      ENABLE_COPPA_COMPLIANCE, ENABLE_DOB_UPDATE, ENABLE_ACCOUNT_DELETION,
    } = getAppConfig(appId);
    const enableCoppaCompliance = parseEnvBoolean(ENABLE_COPPA_COMPLIANCE);
    const shouldUpdateDOB = (
      enableCoppaCompliance
      && parseEnvBoolean(ENABLE_DOB_UPDATE)
      && String(formValues.year_of_birth ?? '') >= COPPA_COMPLIANCE_YEAR.toString()
      && !localStorage.getItem('submittedDOB')
    );
    return (
      <>
        { shouldUpdateDOB
          && (
          <DOBModal
            {...editableFieldProps}
          />
          )}
        <div className="account-section pt-3 mb-5" id="basic-information" ref={navLinkRefs.current['#basic-information']}>
          {
            mostRecentVerifiedName
            && renderVerifiedNameMessage(mostRecentVerifiedName)
          }
          {localStorage.getItem('submittedDOB')
            && (
            <OneTimeDismissibleAlert
              id="updated-dob"
              variant="success"
              icon={CheckCircle}
              header={intl.formatMessage(messages['account.settings.field.dob.form.success'])}
              body=""
            />
            )}

          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.account.information'])}
          </h2>
          <p>{intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          {renderManagedProfileMessage()}

          {renderNameChangeModal()}

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
            {...editableFieldProps}
          />
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
                : renderEmptyStaticFieldMessage()
            }
            helpText={
              verifiedName
                ? renderFullNameHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)
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
            onChange={handleEditableFieldChange}
            onSubmit={handleSubmitProfileName}
          />
          {verifiedName
            && (
            <EditableField
              name="verified_name"
              type="text"
              value={formValues.verified_name}
              label={
                (
                  <div className="d-flex">
                    {intl.formatMessage(messages['account.settings.field.name.verified'])}
                    {
                      renderVerifiedNameIcon(verifiedName.status)
                    }
                  </div>
                )
              }
              helpText={renderVerifiedNameHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)}
              isEditable={isEditable('verifiedName')}
              isGrayedOut={!isEditable('verifiedName')}
              onChange={handleEditableFieldChange}
              onSubmit={handleSubmitVerifiedName}
            />
            )}

          <EmailField
            name="email"
            label={intl.formatMessage(messages['account.settings.field.email'])}
            emptyLabel={
              isEditable('email')
                ? intl.formatMessage(messages['account.settings.field.email.empty'])
                : renderEmptyStaticFieldMessage()
            }
            value={formValues.email}
            confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
            helpText={intl.formatMessage(
              messages['account.settings.field.email.help.text'],
              { siteName: getSiteConfig().siteName },
            )}
            isEditable={isEditable('email')}
            {...editableFieldProps}
          />
          {renderSecondaryEmailField(editableFieldProps)}
          <ResetPassword email={formValues.email} />
          {!enableCoppaCompliance
            && (
            <EditableSelectField
              name="year_of_birth"
              type="select"
              label={intl.formatMessage(messages['account.settings.field.dob'])}
              emptyLabel={intl.formatMessage(messages['account.settings.field.dob.empty'])}
              value={formValues.year_of_birth}
              options={yearOfBirthOptions}
              {...editableFieldProps}
            />
            )}
          <EditableSelectField
            name="country"
            type="select"
            value={formValues.country}
            options={countryOptions}
            label={intl.formatMessage(messages['account.settings.field.country'])}
            emptyLabel={
              isEditable('country')
                ? intl.formatMessage(messages['account.settings.field.country.empty'])
                : renderEmptyStaticFieldMessage()
            }
            isEditable={isEditable('country')}
            {...editableFieldProps}
          />
          {showState
            && (
            <EditableSelectField
              name="state"
              type="select"
              value={formValues.state}
              options={stateOptions}
              label={intl.formatMessage(messages['account.settings.field.state'])}
              emptyLabel={
                isEditable('state')
                  ? intl.formatMessage(messages['account.settings.field.state.empty'])
                  : renderEmptyStaticFieldMessage()
              }
              isEditable={isEditable('state')}
              {...editableFieldProps}
            />
            )}
        </div>

        <div className="account-section pt-3 mb-5" id="profile-information" ref={navLinkRefs.current['#profile-information']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableSelectField
            name="level_of_education"
            type="select"
            value={formValues.level_of_education}
            options={enableCoppaCompliance
              ? educationLevelOptions.filter(option => option.value !== 'el')
              : educationLevelOptions}
            label={intl.formatMessage(messages['account.settings.field.education'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.education.empty'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="gender"
            type="select"
            value={formValues.gender}
            options={genderOptions}
            label={intl.formatMessage(messages['account.settings.field.gender'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.gender.empty'])}
            {...editableFieldProps}
          />
          {hasWorkExperience
          && (
          <EditableSelectField
            name="work_experience"
            type="select"
            value={formValues?.extended_profile?.find(field => field.field_name === 'work_experience')?.field_value}
            options={workExperienceOptions}
            label={intl.formatMessage(messages['account.settings.field.work.experience'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.work.experience.empty'])}
            {...editableFieldProps}
          />
          )}
          <EditableSelectField
            name="language_proficiencies"
            type="select"
            value={formValues.language_proficiencies}
            options={languageProficiencyOptions}
            label={intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
            {...editableFieldProps}
          />

          <AdditionalProfileFieldsSlot />
        </div>
        <div className="account-section pt-3 mb-6" id="social-media">
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </h2>
          <p>
            {intl.formatMessage(
              messages['account.settings.section.social.media.description'],
              { siteName: getSiteConfig().siteName },
            )}
          </p>

          <EditableField
            name="social_link_linkedin"
            type="text"
            value={formValues.social_link_linkedin}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_facebook"
            type="text"
            value={formValues.social_link_facebook}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.facebook'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.facebook.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_x"
            type="text"
            value={formValues.social_link_x}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.xTwitter'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.xTwitter.empty'])}
            {...editableFieldProps}
          />
        </div>
        <div className="border border-light-700" />
        <div className="mt-6" id="notifications" ref={navLinkRefs.current['#notifications']}>
          <NotificationSettings />
        </div>
        <div className="account-section mb-5" id="site-preferences" ref={navLinkRefs.current['#site-preferences']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <EditableSelectField
            name="siteLanguage"
            type="select"
            options={siteLanguageOptions}
            value={drafts.siteLanguage !== undefined ? drafts.siteLanguage : locale}
            label={intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="time_zone"
            type="select"
            value={formValues.time_zone}
            options={localizedTimeZoneOptions}
            label={intl.formatMessage(messages['account.settings.field.time.zone'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.time.zone.empty'])}
            helpText={intl.formatMessage(messages['account.settings.field.time.zone.description'])}
            {...editableFieldProps}
            onSubmit={(formId, value) => {
              // the endpoint will not accept an empty string. it must be null
              handleSubmit(formId, value || null);
            }}
          />
        </div>

        <div className="account-section pt-3 mb-5" id="linked-accounts" ref={navLinkRefs.current['#linked-accounts']}>
          <h2 className="section-heading h4 mb-3">{intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>
            {intl.formatMessage(
              messages['account.settings.section.linked.accounts.description'],
              { siteName: getSiteConfig().siteName },
            )}
          </p>
          <ThirdPartyAuth />
        </div>

        {parseEnvBoolean(ENABLE_ACCOUNT_DELETION) && (
          <div className="account-section pt-3 mb-5" id="delete-account" ref={navLinkRefs.current['#delete-account']}>
            <DeleteAccount
              isVerifiedAccount={isActive}
              hasLinkedTPA={hasLinkedTPA}
              canDeleteAccount={canDeleteAccount()}
            />
          </div>
        )}
      </>
    );
  };

  const renderError = () => (
    <Alert variant="danger">
      <Alert.Heading>
        {intl.formatMessage(messages['account.settings.loading.error.heading'])}
      </Alert.Heading>
      <p>
        {intl.formatMessage(messages['account.settings.loading.error.body'])}
      </p>
    </Alert>
  );

  const renderLoading = () => (
    <PageLoading srMessage={intl.formatMessage(messages['account.settings.loading.message'])} />
  );

  return (
    <div className="page__account-settings">
      {renderThirdPartyAuthErrorMessage()}
      <h1 className="mb-4">
        {intl.formatMessage(messages['account.settings.page.heading'])}
      </h1>
      <div>
        <div className="row">
          <div className="col-md-3">
            <JumpNav />
          </div>
          <div className="col-md-9">
            {isPending && !isError ? renderLoading() : null}
            {loaded ? renderContent() : null}
            {isError ? renderError() : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSettingsPage = () => (
  <AccountSettingsFormProvider>
    <AccountSettingsPageContent />
  </AccountSettingsFormProvider>
);

export default AccountSettingsPage;
