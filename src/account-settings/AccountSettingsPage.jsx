import { FormattedMessage, getAppConfig, getQueryParameters, getSiteConfig, sendTrackingLogEvent, SiteContext, useIntl } from '@openedx/frontend-base';
import { CheckCircle, Error, WarningFilled } from '@openedx/paragon/icons';
import { Alert, Hyperlink, Icon } from '@openedx/paragon';
import findIndex from 'lodash.findindex';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import NotificationSettings from '../notification-preferences/NotificationSettings';
import { fetchCourseList } from '../notification-preferences/data/thunks';
import OneTimeDismissibleAlert from './OneTimeDismissibleAlert';
import EditableSelectField from './EditableSelectField';
import { getCountryList, getLanguageList } from './site-language/utils';
import BetaLanguageBanner from './BetaLanguageBanner';
import ThirdPartyAuth from './third-party-auth';
import { COPPA_COMPLIANCE_YEAR, COUNTRY_WITH_STATES, EDUCATION_LEVELS, FIELD_LABELS, GENDER_OPTIONS, getStatesList, WORK_EXPERIENCE_OPTIONS, YEAR_OF_BIRTH_OPTIONS } from './data/constants';
import { accountSettingsPageSelector } from './data/selectors';
import DeleteAccount from './delete-account';
import ResetPassword from './reset-password';
import EditableField from './EditableField';
import { fetchSiteLanguages } from './site-language';
import { beginNameChange, fetchSettings, saveMultipleSettings, saveSettings, updateDraft } from './data/actions';
import NameChange from './name-change';
import PageLoading from './PageLoading';
import { appId } from '../constants';
import EmailField from './EmailField';
import messages from './messages';
import DOBModal from './DOBForm';
import JumpNav from './JumpNav';
import { withLocation, withNavigate } from './hoc';

const AccountSettingsPage = ({
  loading,
  loaded,
  loadingError,
  formValues,
  committedValues,
  drafts,
  formErrors,
  siteLanguage,
  siteLanguageOptions,
  profileDataManager,
  staticFields,
  isActive,
  secondary_email_enabled,
  timeZoneOptions,
  countryTimeZoneOptions,
  fetchSiteLanguages,
  updateDraft,
  saveMultipleSettings,
  saveSettings,
  fetchSettings,
  beginNameChange,
  fetchCourseList,
  tpaProviders,
  nameChangeModal,
  verifiedName,
  mostRecentVerifiedName,
  verifiedNameHistory,
  navigate,
  location,
  countriesCodesList,
}) => {
  const intl = useIntl();
  const context = useContext(SiteContext);

  // State
  const duplicateTpaProvider = getQueryParameters().duplicate_provider;
  const [duplicateTpaProviderState] = useState(duplicateTpaProvider);

  // Refs for navigation
  const navLinkRefs = useRef({
    '#basic-information': React.createRef(),
    '#profile-information': React.createRef(),
    '#social-media': React.createRef(),
    '#notifications': React.createRef(),
    '#site-preferences': React.createRef(),
    '#linked-accounts': React.createRef(),
    '#delete-account': React.createRef(),
  });

  // Effect for componentDidMount
  useEffect(() => {
    fetchCourseList();
    fetchSettings();
    fetchSiteLanguages(navigate);
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: context.authenticatedUser.userId,
    });
  }, [fetchCourseList, fetchSettings, fetchSiteLanguages, navigate, context.authenticatedUser.userId]);

  // Effect for componentDidUpdate (scroll to hash on load)
  useEffect(() => {
    if (loaded) {
      const locationHash = global.location.hash;
      // Check for the locationHash in the URL and then scroll to it if it is in the
      // NavLinks list
      if (typeof locationHash !== 'string') {
        return;
      }
      if (Object.keys(navLinkRefs.current).includes(locationHash) && navLinkRefs.current[locationHash].current) {
        window.scrollTo(0, navLinkRefs.current[locationHash].current.offsetTop);
      }
    }
  }, [loaded]);

  // NOTE: We need 'locale' for the memoization in getLocalizedTimeZoneOptions.  Don't remove it!
  // eslint-disable-next-line no-unused-vars
  const getLocalizedTimeZoneOptions = useMemo(() => memoize((timeZoneOptionsFormatted, countryTimeZoneOptions, locale) => {
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
      group: timeZoneOptionsFormatted,
    });
    return concatTimeZoneOptions;
  }), [intl]);

  const getLocalizedOptions = useMemo(() => memoize((locale, country) => ({
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
    }].concat(getStatesList(country)),
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
  })), [intl]);

  const canDeleteAccount = () => {
    return !getAppConfig(appId).COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED.includes(committedValues.country);
  };

  const removeDisabledCountries = (countryList) => {
    const committedCountry = committedValues?.country;

    if (!countriesCodesList.length) {
      return countryList;
    }
    return countryList.filter(({ value }) => value === committedCountry || countriesCodesList.find(x => x === value));
  };

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

  const isDisabledCountry = (country) => {
    return countriesCodesList.length > 0 && !countriesCodesList.find(x => x === country);
  };

  const isEditable = (fieldName) => {
    return !staticFields.includes(fieldName);
  };

  const isManagedProfile = () => {
    // Enterprise customer profiles are managed by their organizations. We determine whether
    // a profile is managed or not by the presence of the profileDataManager prop.
    return Boolean(profileDataManager);
  };

  const renderDuplicateTpaProviderMessage = () => {
    if (!duplicateTpaProviderState) {
      return null;
    }

    // If there is a "duplicate_provider" query parameter, that's the backend's
    // way of telling us that the provider account the user tried to link is already linked
    // to another user account on the platform. We use this to display a message to that effect,
    // and remove the parameter from the URL.
    navigate(location, { replace: true });

    return (
      <div>
        <Alert variant="danger">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another {siteName} account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another account"
            values={{
              provider: <b>{duplicateTpaProviderState}</b>,
              siteName: getSiteConfig().siteName,
            }}
          />
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

  const renderVerifiedNameSuccessMessage = (verifiedName, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameSuccessMessage-${verifiedName}-${dateValue}`;

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

  const renderVerifiedNameFailureMessage = (verifiedName, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameFailureMessage-${verifiedName}-${dateValue}`;

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

  const renderVerifiedNameMessage = verifiedNameRecord => {
    const {
      created,
      status,
      profile_name: profileName,
      verified_name: verifiedName,
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
        return renderVerifiedNameSuccessMessage(verifiedName, created);
      case 'denied':
        return renderVerifiedNameFailureMessage(verifiedName, created);
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

    // Memoized options lists
    const {
      countryOptions,
      stateOptions,
      languageProficiencyOptions,
      yearOfBirthOptions,
      educationLevelOptions,
      genderOptions,
      workExperienceOptions,
    } = getLocalizedOptions(context.locale, formValues.country);

    // Show State field only if the country is US (could include Canada later)
    const { country } = formValues;
    const showState = country === COUNTRY_WITH_STATES && !isDisabledCountry(country);

    const hasWorkExperience = !!formValues?.extended_profile?.find(field => field.field_name === 'work_experience');

    const timeZoneOptionsFormatted = getLocalizedTimeZoneOptions(
      timeZoneOptions,
      countryTimeZoneOptions,
      context.locale,
    );    const hasLinkedTPA = findIndex(tpaProviders, provider => provider.connected) >= 0;

    // if user is under 13 and does not have cookie set
    const shouldUpdateDOB = (
      getAppConfig(appId).ENABLE_COPPA_COMPLIANCE
      && getAppConfig(appId).ENABLE_DOB_UPDATE
      && formValues.year_of_birth.toString() >= COPPA_COMPLIANCE_YEAR.toString()
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
          {(!getAppConfig(appId).ENABLE_COPPA_COMPLIANCE)
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
            options={getAppConfig(appId).ENABLE_COPPA_COMPLIANCE
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
            name="social_link_twitter"
            type="text"
            value={formValues.social_link_twitter}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.twitter'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.twitter.empty'])}
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

          <BetaLanguageBanner />
          <EditableSelectField
            name="siteLanguage"
            type="select"
            options={siteLanguageOptions}
            value={siteLanguage.draft !== undefined ? siteLanguage.draft : context.locale}
            label={intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="time_zone"
            type="select"
            value={formValues.time_zone}
            options={timeZoneOptionsFormatted}
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

        {getAppConfig(appId).ENABLE_ACCOUNT_DELETION && (
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
  }

  const renderError = () => {
    return (
      <div>
        {intl.formatMessage(messages['account.settings.loading.error'], {
          error: loadingError,
        })}
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <PageLoading srMessage={intl.formatMessage(messages['account.settings.loading.message'])} />
    );
  };

  return (
    <div className="page__account-settings container-fluid py-5">
      {renderDuplicateTpaProviderMessage()}
      <h1 className="mb-4">
        {intl.formatMessage(messages['account.settings.page.heading'])}
      </h1>
      <div>
        <div className="row">
          <div className="col-md-2">
            <JumpNav />
          </div>
          <div className="col-md-10">
            {loading ? renderLoading() : null}
            {loaded ? renderContent() : null}
            {loadingError ? renderError() : null}
          </div>
        </div>
      </div>
    </div>
  );
};

AccountSettingsPage.propTypes = {
  loading: PropTypes.bool,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,

  // Form data
  formValues: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    secondary_email: PropTypes.string,
    secondary_email_enabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    year_of_birth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    country: PropTypes.string,
    level_of_education: PropTypes.string,
    gender: PropTypes.string,
    extended_profile: PropTypes.arrayOf(PropTypes.shape({
      field_name: PropTypes.string,
      field_value: PropTypes.string,
    })),
    language_proficiencies: PropTypes.string,
    pending_name_change: PropTypes.string,
    phone_number: PropTypes.string,
    social_link_linkedin: PropTypes.string,
    social_link_facebook: PropTypes.string,
    social_link_twitter: PropTypes.string,
    time_zone: PropTypes.string,
    state: PropTypes.string,
    useVerifiedNameForCerts: PropTypes.bool.isRequired,
    verified_name: PropTypes.string,
  }).isRequired,
  committedValues: PropTypes.shape({
    name: PropTypes.string,
    useVerifiedNameForCerts: PropTypes.bool,
    verified_name: PropTypes.string,
    country: PropTypes.string,
  }),
  drafts: PropTypes.shape({}),
  formErrors: PropTypes.shape({
    name: PropTypes.string,
  }),
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draft: PropTypes.string,
  }),
  siteLanguageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  profileDataManager: PropTypes.string,
  staticFields: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,
  secondary_email_enabled: PropTypes.bool,

  timeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  countryTimeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  fetchSiteLanguages: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  saveMultipleSettings: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  beginNameChange: PropTypes.func.isRequired,
  fetchCourseList: PropTypes.func.isRequired,
  tpaProviders: PropTypes.arrayOf(PropTypes.shape({
    connected: PropTypes.bool,
  })),
  nameChangeModal: PropTypes.oneOfType([
    PropTypes.shape({
      formId: PropTypes.string,
    }),
    PropTypes.bool,
  ]),
  verifiedName: PropTypes.shape({
    verified_name: PropTypes.string,
    status: PropTypes.string,
    proctored_exam_attempt_id: PropTypes.number,
  }),
  mostRecentVerifiedName: PropTypes.shape({
    verified_name: PropTypes.string,
    status: PropTypes.string,
    proctored_exam_attempt_id: PropTypes.number,
  }),
  verifiedNameHistory: PropTypes.arrayOf(
    PropTypes.shape({
      verified_name: PropTypes.string,
      status: PropTypes.string,
      proctored_exam_attempt_id: PropTypes.number,
    }),
  ),
  navigate: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  countriesCodesList: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  committedValues: {
    useVerifiedNameForCerts: false,
    verified_name: null,
    country: '',
  },
  drafts: {},
  formErrors: {},
  siteLanguage: null,
  siteLanguageOptions: [],
  timeZoneOptions: [],
  countryTimeZoneOptions: [],
  profileDataManager: null,
  staticFields: [],
  tpaProviders: [],
  isActive: true,
  secondary_email_enabled: false,
  nameChangeModal: {} || false,
  verifiedName: null,
  mostRecentVerifiedName: {},
  verifiedNameHistory: [],
  countriesCodesList: [],
};

export default withLocation(withNavigate(connect(accountSettingsPageSelector, {
  fetchCourseList,
  fetchSettings,
  saveSettings,
  saveMultipleSettings,
  updateDraft,
  fetchSiteLanguages,
  beginNameChange,
})(AccountSettingsPage)));
