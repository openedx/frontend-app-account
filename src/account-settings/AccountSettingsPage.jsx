import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import {
  useEffect, useContext, useMemo, createRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import findIndex from 'lodash.findindex';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import {
  FormattedMessage,
  getCountryList,
  getLanguageList,
  useIntl,
} from '@edx/frontend-platform/i18n';
import {
  Container, Hyperlink, Icon, Alert,
} from '@openedx/paragon';
import { CheckCircle, Error, WarningFilled } from '@openedx/paragon/icons';

import messages from './AccountSettingsPage.messages';
import {
  fetchSettings,
  saveMultipleSettings,
  saveSettings,
  updateDraft,
  beginNameChange,
} from './data/actions';
import { accountSettingsPageSelector } from './data/selectors';
import PageLoading from './PageLoading';
import JumpNav from './JumpNav';
import DeleteAccount from './delete-account';
import EditableField from './EditableField';
import EditableSelectField from './EditableSelectField';
import ResetPassword from './reset-password';
import NameChange from './name-change';
import ThirdPartyAuth from './third-party-auth';
import BetaLanguageBanner from './BetaLanguageBanner';
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
import { fetchSiteLanguages } from './site-language';
import { fetchNotificationPreferences } from '../notification-preferences/data/thunks';
import NotificationSettings from '../notification-preferences/NotificationSettings';
import { withLocation, withNavigate } from './hoc';
import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

const AccountSettingsPage = ({
  loading = false,
  loaded = false,
  loadingError = null,
  nameChangeModal = {} || false,
  navigate,
  countriesCodesList = [],
  profileDataManager = null,
  committedValues = {
    useVerifiedNameForCerts: false,
    verified_name: null,
    country: '',
  },
  ...props
}) => {
  const intl = useIntl();
  const appContext = useContext(AppContext);
  const [duplicateTpaProvider, setDuplicateTpaProvider] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialDuplicateTpaProvider = searchParams.get('duplicate_provider');
    if (initialDuplicateTpaProvider) {
      setDuplicateTpaProvider(initialDuplicateTpaProvider);
    }
    props.fetchNotificationPreferences();
    props.fetchSettings();
    props.fetchSiteLanguages(navigate);
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: appContext.authenticatedUser.userId,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navLinkRefs = useMemo(() => ({
    '#basic-information': createRef(),
    '#profile-information': createRef(),
    '#social-media': createRef(),
    '#notifications': createRef(),
    '#site-preferences': createRef(),
    '#linked-accounts': createRef(),
    '#delete-account': createRef(),
  }), []);

  useEffect(() => {
    if (loading && !loaded && loaded) {
      const locationHash = global.location.hash;
      // Check for the locationHash in the URL and then scroll to it if it is in the
      // NavLinks list
      if (typeof locationHash !== 'string') {
        return;
      }
      if (Object.keys(navLinkRefs).includes(locationHash) && navLinkRefs[locationHash].current) {
        window.scrollTo(0, navLinkRefs[locationHash].current.offsetTop);
      }
    }
  }, [loading, loaded, navLinkRefs]);

  // NOTE: We need 'locale' for the memoization in getLocalizedTimeZoneOptions.  Don't remove it!
  // eslint-disable-next-line no-unused-vars
  const getLocalizedTimeZoneOptions = memoize((timeZoneOptions, countryTimeZoneOptions, locale) => {
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
  });

  const removeDisabledCountries = (countryList) => {
    const committedCountry = committedValues?.country;

    if (!countriesCodesList.length) {
      return countryList;
    }
    return countryList.filter(({ value }) => value === committedCountry || countriesCodesList.find(x => x === value));
  };

  const isDisabledCountry = (country) => countriesCodesList.length > 0 && !countriesCodesList.find(x => x === country);

  const getLocalizedOptions = memoize((locale, country) => ({
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
  }));

  const canDeleteAccount = () => !getConfig().COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED.includes(committedValues.country);

  const handleEditableFieldChange = (name, value) => {
    updateDraft(name, value);
  };

  const handleSubmit = (formId, values) => {
    if (formId === FIELD_LABELS.COUNTRY && isDisabledCountry(values)) {
      return;
    }

    const { formValues } = props;
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
    if (Object.keys(props.drafts).includes('useVerifiedNameForCerts')) {
      saveMultipleSettings([
        {
          formId,
          commitValues: values,
        },
        {
          formId: 'useVerifiedNameForCerts',
          commitValues: props.formValues.useVerifiedNameForCerts,
        },
      ], formId);
    } else {
      saveSettings(formId, values);
    }
  };

  const handleSubmitVerifiedName = (formId, values) => {
    if (Object.keys(props.drafts).includes('useVerifiedNameForCerts')) {
      saveSettings('useVerifiedNameForCerts', props.formValues.useVerifiedNameForCerts);
    }
    if (values !== props.committedValues?.verified_name) {
      beginNameChange(formId);
    } else {
      saveSettings(formId, values);
    }
  };

  const isEditable = (fieldName) => !props.staticFields.includes(fieldName);

  // Enterprise customer profiles are managed by their organizations. We determine whether
  // a profile is managed or not by the presence of the profileDataManager prop.
  const isManagedProfile = () => Boolean(profileDataManager);

  const renderDuplicateTpaProviderMessage = () => {
    if (!duplicateTpaProvider) {
      return null;
    }

    // If there is a "duplicate_provider" query parameter, that's the backend's
    // way of telling us that the provider account the user tried to link is already linked
    // to another user account on the platform. We use this to display a message to that effect,
    // and remove the parameter from the URL.
    navigate(props.location, { replace: true });

    return (
      <div>
        <Alert variant="danger">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another {siteName} account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another account"
            values={{
              provider: <b>{duplicateTpaProvider}</b>,
              siteName: getConfig().SITE_NAME,
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
                <Hyperlink destination={getConfig().SUPPORT_URL} target="_blank">
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
    if (!props.verifiedNameHistory) {
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

    if (!props.committedValues.useVerifiedNameForCerts) {
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
        props.committedValues.name !== profileName
        && !props.committedValues.useVerifiedNameForCerts
      )
      || (
        // User submitted a verified name change, and uses their verified name on certificates
        props.committedValues.name === profileName
        && props.committedValues.useVerifiedNameForCerts
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
    if (props.committedValues.useVerifiedNameForCerts) {
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
    if (!props.formValues.secondary_email_enabled) {
      return null;
    }

    return (
      <EmailField
        name="secondary_email"
        label={intl.formatMessage(messages['account.settings.field.secondary.email'])}
        emptyLabel={intl.formatMessage(messages['account.settings.field.secondary.email.empty'])}
        value={props.formValues.secondary_email}
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
    } = getLocalizedOptions(appContext.locale, props.formValues.country);

    // Show State field only if the country is US (could include Canada later)
    const { country } = props.formValues;
    const showState = country === COUNTRY_WITH_STATES && !isDisabledCountry(country);
    const { verifiedName } = props;

    const hasWorkExperience = !!props.formValues?.extended_profile?.find(field => field.field_name === 'work_experience');

    const timeZoneOptions = getLocalizedTimeZoneOptions(
      props.timeZoneOptions,
      props.countryTimeZoneOptions,
      appContext.locale,
    );

    const hasLinkedTPA = findIndex(props.tpaProviders, provider => provider.connected) >= 0;

    // if user is under 13 and does not have cookie set
    const shouldUpdateDOB = (
      getConfig().ENABLE_COPPA_COMPLIANCE
      && getConfig().ENABLE_DOB_UPDATE
      && props.formValues.year_of_birth.toString() >= COPPA_COMPLIANCE_YEAR.toString()
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
        <div className="account-section pt-3 mb-5" id="basic-information" ref={navLinkRefs['#basic-information']}>
          {
            props.mostRecentVerifiedName
            && renderVerifiedNameMessage(props.mostRecentVerifiedName)
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
            value={props.formValues.username}
            label={intl.formatMessage(messages['account.settings.field.username'])}
            helpText={intl.formatMessage(
              messages['account.settings.field.username.help.text'],
              { siteName: getConfig().SITE_NAME },
            )}
            isEditable={false}
            {...editableFieldProps}
          />
          <EditableField
            name="name"
            type="text"
            value={
              verifiedName?.status === 'submitted'
              && props.formValues.pending_name_change
                ? props.formValues.pending_name_change
                : props.formValues.name
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
              value={props.formValues.verified_name}
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
            value={props.formValues.email}
            confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
            helpText={intl.formatMessage(
              messages['account.settings.field.email.help.text'],
              { siteName: getConfig().SITE_NAME },
            )}
            isEditable={isEditable('email')}
            {...editableFieldProps}
          />
          {renderSecondaryEmailField(editableFieldProps)}
          <ResetPassword email={props.formValues.email} />
          {(!getConfig().ENABLE_COPPA_COMPLIANCE)
            && (
            <EditableSelectField
              name="year_of_birth"
              type="select"
              label={intl.formatMessage(messages['account.settings.field.dob'])}
              emptyLabel={intl.formatMessage(messages['account.settings.field.dob.empty'])}
              value={props.formValues.year_of_birth}
              options={yearOfBirthOptions}
              {...editableFieldProps}
            />
            )}
          <EditableSelectField
            name="country"
            type="select"
            value={props.formValues.country}
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
              value={props.formValues.state}
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

        <div className="account-section pt-3 mb-5" id="profile-information" ref={navLinkRefs['#profile-information']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableSelectField
            name="level_of_education"
            type="select"
            value={props.formValues.level_of_education}
            options={getConfig().ENABLE_COPPA_COMPLIANCE
              ? educationLevelOptions.filter(option => option.value !== 'el')
              : educationLevelOptions}
            label={intl.formatMessage(messages['account.settings.field.education'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.education.empty'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="gender"
            type="select"
            value={props.formValues.gender}
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
            value={props.formValues?.extended_profile?.find(field => field.field_name === 'work_experience')?.field_value}
            options={workExperienceOptions}
            label={intl.formatMessage(messages['account.settings.field.work.experience'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.work.experience.empty'])}
            {...editableFieldProps}
          />
          )}
          <EditableSelectField
            name="language_proficiencies"
            type="select"
            value={props.formValues.language_proficiencies}
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
              { siteName: getConfig().SITE_NAME },
            )}
          </p>

          <EditableField
            name="social_link_linkedin"
            type="text"
            value={props.formValues.social_link_linkedin}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_facebook"
            type="text"
            value={props.formValues.social_link_facebook}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.facebook'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.facebook.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_twitter"
            type="text"
            value={props.formValues.social_link_twitter}
            label={intl.formatMessage(messages['account.settings.field.social.platform.name.twitter'])}
            emptyLabel={intl.formatMessage(messages['account.settings.field.social.platform.name.twitter.empty'])}
            {...editableFieldProps}
          />
        </div>
        <div className="border border-light-700" />
        <div className="mt-6" id="notifications" ref={navLinkRefs['#notifications']}>
          <NotificationSettings />
        </div>
        <div className="account-section mb-5" id="site-preferences" ref={navLinkRefs['#site-preferences']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <BetaLanguageBanner />
          <EditableSelectField
            name="siteLanguage"
            type="select"
            options={props.siteLanguageOptions}
            value={props.siteLanguage.draft !== undefined ? props.siteLanguage.draft : appContext.locale}
            label={intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="time_zone"
            type="select"
            value={props.formValues.time_zone}
            options={timeZoneOptions}
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

        <div className="account-section pt-3 mb-5" id="linked-accounts" ref={navLinkRefs['#linked-accounts']}>
          <h2 className="section-heading h4 mb-3">{intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>
            {intl.formatMessage(
              messages['account.settings.section.linked.accounts.description'],
              { siteName: getConfig().SITE_NAME },
            )}
          </p>
          <ThirdPartyAuth />
        </div>

        {getConfig().ENABLE_ACCOUNT_DELETION && (
          <div className="account-section pt-3 mb-5" id="delete-account" ref={navLinkRefs['#delete-account']}>
            <DeleteAccount
              isVerifiedAccount={props.isActive}
              hasLinkedTPA={hasLinkedTPA}
              canDeleteAccount={canDeleteAccount()}
            />
          </div>
        )}
      </>
    );
  };

  const renderError = () => (
    <div>
      {intl.formatMessage(messages['account.settings.loading.error'], {
        error: loadingError,
      })}
    </div>
  );

  const renderLoading = () => (
    <PageLoading srMessage={intl.formatMessage(messages['account.settings.loading.message'])} />
  );

  return (
    <Container className="page__account-settings py-5" size="xl">
      {renderDuplicateTpaProviderMessage()}
      <h1 className="mb-4">
        {intl.formatMessage(messages['account.settings.page.heading'])}
      </h1>
      <div>
        <div className="row">
          <div className="col-md-3">
            <JumpNav />
          </div>
          <div className="col-md-9">
            {loading ? renderLoading() : null}
            {loaded ? renderContent() : null}
            {loadingError ? renderError() : null}
          </div>
        </div>
      </div>
    </Container>
  );
};

AccountSettingsPage.propTypes = {
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
  fetchNotificationPreferences: PropTypes.func.isRequired,
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
  fetchNotificationPreferences,
  fetchSettings,
  saveSettings,
  saveMultipleSettings,
  updateDraft,
  fetchSiteLanguages,
  beginNameChange,
})(AccountSettingsPage)));
