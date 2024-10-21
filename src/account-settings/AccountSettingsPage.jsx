import { AppContext } from '@edx/frontend-platform/react';
import { getConfig, getQueryParameters } from '@edx/frontend-platform';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import findIndex from 'lodash.findindex';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
  getCountryList,
  getLanguageList,
} from '@edx/frontend-platform/i18n';
import {
  Hyperlink, Icon, Alert,
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
} from './data/constants';
import { fetchSiteLanguages } from './site-language';
import { fetchCourseList } from '../notification-preferences/data/thunks';
import { withLocation, withNavigate } from './hoc';

class AccountSettingsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const duplicateTpaProvider = getQueryParameters().duplicate_provider;
    this.state = {
      duplicateTpaProvider,
    };

    this.navLinkRefs = {
      '#basic-information': React.createRef(),
      '#profile-information': React.createRef(),
      '#social-media': React.createRef(),
      '#site-preferences': React.createRef(),
      '#linked-accounts': React.createRef(),
      '#delete-account': React.createRef(),
    };
  }

  componentDidMount() {
    this.props.fetchCourseList();
    this.props.fetchSettings();
    this.props.fetchSiteLanguages(this.props.navigate);
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: this.context.authenticatedUser.userId,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !prevProps.loaded && this.props.loaded) {
      const locationHash = global.location.hash;
      // Check for the locationHash in the URL and then scroll to it if it is in the
      // NavLinks list
      if (typeof locationHash !== 'string') {
        return;
      }
      if (Object.keys(this.navLinkRefs).includes(locationHash) && this.navLinkRefs[locationHash].current) {
        window.scrollTo(0, this.navLinkRefs[locationHash].current.offsetTop);
      }
    }
  }

  // NOTE: We need 'locale' for the memoization in getLocalizedTimeZoneOptions.  Don't remove it!
  // eslint-disable-next-line no-unused-vars
  getLocalizedTimeZoneOptions = memoize((timeZoneOptions, countryTimeZoneOptions, locale) => {
    const concatTimeZoneOptions = [{
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.default']),
      value: '',
    }];
    if (countryTimeZoneOptions.length) {
      concatTimeZoneOptions.push({
        label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.country']),
        group: countryTimeZoneOptions,
      });
    }
    concatTimeZoneOptions.push({
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.all']),
      group: timeZoneOptions,
    });
    return concatTimeZoneOptions;
  });

  getLocalizedOptions = memoize((locale, country) => ({
    countryOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.country.options.empty']),
    }].concat(getCountryList(locale).map(({ code, name }) => ({ value: code, label: name }))),
    stateOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.state.options.empty']),
    }].concat(getStatesList(country)),
    languageProficiencyOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.language_proficiencies.options.empty']),
    }].concat(getLanguageList(locale).map(({ code, name }) => ({ value: code, label: name }))),
    yearOfBirthOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.year_of_birth.options.empty']),
    }].concat(YEAR_OF_BIRTH_OPTIONS),
    educationLevelOptions: EDUCATION_LEVELS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.education.levels.${key || 'empty'}`]),
    })),
    genderOptions: GENDER_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.gender.options.${key || 'empty'}`]),
    })),
    workExperienceOptions: WORK_EXPERIENCE_OPTIONS.map(key => ({
      value: key,
      label: key === '' ? this.props.intl.formatMessage(messages['account.settings.field.work.experience.options.empty']) : key,
    })),
  }));

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    const { formValues } = this.props;
    let extendedProfileObject = {};

    if ('extended_profile' in formValues && formValues.extended_profile.some((field) => field.field_name === formId)) {
      extendedProfileObject = {
        extended_profile: formValues.extended_profile.map(field => (field.field_name === formId
          ? { ...field, field_value: values }
          : field)),
      };
    }
    this.props.saveSettings(formId, values, extendedProfileObject);
  };

  handleSubmitProfileName = (formId, values) => {
    if (Object.keys(this.props.drafts).includes('useVerifiedNameForCerts')) {
      this.props.saveMultipleSettings([
        {
          formId,
          commitValues: values,
        },
        {
          formId: 'useVerifiedNameForCerts',
          commitValues: this.props.formValues.useVerifiedNameForCerts,
        },
      ], formId);
    } else {
      this.props.saveSettings(formId, values);
    }
  };

  handleSubmitVerifiedName = (formId, values) => {
    if (Object.keys(this.props.drafts).includes('useVerifiedNameForCerts')) {
      this.props.saveSettings('useVerifiedNameForCerts', this.props.formValues.useVerifiedNameForCerts);
    }
    if (values !== this.props.committedValues?.verified_name) {
      this.props.beginNameChange(formId);
    } else {
      this.props.saveSettings(formId, values);
    }
  };

  isEditable(fieldName) {
    return !this.props.staticFields.includes(fieldName);
  }

  isManagedProfile() {
    // Enterprise customer profiles are managed by their organizations. We determine whether
    // a profile is managed or not by the presence of the profileDataManager prop.
    return Boolean(this.props.profileDataManager);
  }

  renderDuplicateTpaProviderMessage() {
    if (!this.state.duplicateTpaProvider) {
      return null;
    }

    // If there is a "duplicate_provider" query parameter, that's the backend's
    // way of telling us that the provider account the user tried to link is already linked
    // to another user account on the platform. We use this to display a message to that effect,
    // and remove the parameter from the URL.
    this.props.navigate(this.props.location, { replace: true });

    return (
      <div>
        <Alert variant="danger">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another {siteName} account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another account"
            values={{
              provider: <b>{this.state.duplicateTpaProvider}</b>,
              siteName: getConfig().SITE_NAME,
            }}
          />
        </Alert>
      </div>
    );
  }

  renderManagedProfileMessage() {
    if (!this.isManagedProfile()) {
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
              managerTitle: <b>{this.props.profileDataManager}</b>,
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
  }

  renderFullNameHelpText = (status, proctoredExamId) => {
    if (!this.props.verifiedNameHistory) {
      return this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text']);
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

    if (!this.props.committedValues.useVerifiedNameForCerts) {
      messageString += '.certificate';
    }

    return this.props.intl.formatMessage(messages[messageString]);
  };

  renderVerifiedNameSuccessMessage = (verifiedName, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameSuccessMessage-${verifiedName}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="success"
        icon={CheckCircle}
        header={this.props.intl.formatMessage(messages['account.settings.field.name.verified.success.message.header'])}
        body={this.props.intl.formatMessage(messages['account.settings.field.name.verified.success.message'])}
      />
    );
  };

  renderVerifiedNameFailureMessage = (verifiedName, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameFailureMessage-${verifiedName}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="danger"
        icon={Error}
        header={this.props.intl.formatMessage(messages['account.settings.field.name.verified.failure.message.header'])}
        body={
          (
            <div className="d-flex flex-row">
              {this.props.intl.formatMessage(messages['account.settings.field.name.verified.failure.message'])}
            </div>
          )
        }
      />
    );
  };

  renderVerifiedNameSubmittedMessage = (willCertNameChange) => (
    <Alert
      variant="warning"
      icon={WarningFilled}
    >
      <Alert.Heading>
        {this.props.intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.header'])}
      </Alert.Heading>
      <p>
        {this.props.intl.formatMessage(messages['account.settings.field.name.verified.submitted.message'])}{' '}
        {
          willCertNameChange
          && this.props.intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.certificate'])
        }
      </p>
    </Alert>
  );

  renderVerifiedNameMessage = verifiedNameRecord => {
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
        this.props.committedValues.name !== profileName
        && !this.props.committedValues.useVerifiedNameForCerts
      )
      || (
        // User submitted a verified name change, and uses their verified name on certificates
        this.props.committedValues.name === profileName
        && this.props.committedValues.useVerifiedNameForCerts
      )
    ) {
      willCertNameChange = true;
    }

    if (proctoredExamId) {
      return null;
    }

    switch (status) {
      case 'approved':
        return this.renderVerifiedNameSuccessMessage(verifiedName, created);
      case 'denied':
        return this.renderVerifiedNameFailureMessage(verifiedName, created);
      case 'submitted':
        return this.renderVerifiedNameSubmittedMessage(willCertNameChange);
      default:
        return null;
    }
  };

  renderVerifiedNameIcon = (status) => {
    switch (status) {
      case 'approved':
        return (<Icon src={CheckCircle} className="ml-1" style={{ height: '18px', width: '18px', color: 'green' }} />);
      case 'submitted':
        return (<Icon src={WarningFilled} className="ml-1" style={{ height: '18px', width: '18px', color: 'yellow' }} />);
      default:
        return null;
    }
  };

  renderVerifiedNameHelpText = (status, proctoredExamId) => {
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
    if (this.props.committedValues.useVerifiedNameForCerts) {
      messageStr += '.certificate';
    }

    return this.props.intl.formatMessage(messages[messageStr]);
  };

  renderEmptyStaticFieldMessage() {
    if (this.isManagedProfile()) {
      return this.props.intl.formatMessage(messages['account.settings.static.field.empty'], {
        enterprise: this.props.profileDataManager,
      });
    }
    return this.props.intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);
  }

  renderNameChangeModal() {
    if (this.props.nameChangeModal && this.props.nameChangeModal.formId) {
      return <NameChange targetFormId={this.props.nameChangeModal.formId} />;
    }
    return null;
  }

  renderSecondaryEmailField(editableFieldProps) {
    if (!this.props.formValues.secondary_email_enabled) {
      return null;
    }

    return (
      <EmailField
        name="secondary_email"
        label={this.props.intl.formatMessage(messages['account.settings.field.secondary.email'])}
        emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.secondary.email.empty'])}
        value={this.props.formValues.secondary_email}
        confirmationMessageDefinition={messages['account.settings.field.secondary.email.confirmation']}
        {...editableFieldProps}
      />
    );
  }

  renderContent() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
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
    } = this.getLocalizedOptions(this.context.locale, this.props.formValues.country);

    // Show State field only if the country is US (could include Canada later)
    const showState = this.props.formValues.country === COUNTRY_WITH_STATES;
    const { verifiedName } = this.props;

    const hasWorkExperience = !!this.props.formValues?.extended_profile?.find(field => field.field_name === 'work_experience');

    const timeZoneOptions = this.getLocalizedTimeZoneOptions(
      this.props.timeZoneOptions,
      this.props.countryTimeZoneOptions,
      this.context.locale,
    );

    const hasLinkedTPA = findIndex(this.props.tpaProviders, provider => provider.connected) >= 0;

    // if user is under 13 and does not have cookie set
    const shouldUpdateDOB = (
      getConfig().ENABLE_COPPA_COMPLIANCE
      && getConfig().ENABLE_DOB_UPDATE
      && this.props.formValues.year_of_birth.toString() >= COPPA_COMPLIANCE_YEAR.toString()
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
        <div className="account-section pt-3 mb-5" id="basic-information" ref={this.navLinkRefs['#basic-information']}>
          {
            this.props.mostRecentVerifiedName
            && this.renderVerifiedNameMessage(this.props.mostRecentVerifiedName)
          }
          {localStorage.getItem('submittedDOB')
            && (
            <OneTimeDismissibleAlert
              id="updated-dob"
              variant="success"
              icon={CheckCircle}
              header={this.props.intl.formatMessage(messages['account.settings.field.dob.form.success'])}
              body=""
            />
            )}

          <h2 className="section-heading h4 mb-3">
            {this.props.intl.formatMessage(messages['account.settings.section.account.information'])}
          </h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          {this.renderManagedProfileMessage()}

          {this.renderNameChangeModal()}

          <EditableField
            name="username"
            type="text"
            value={this.props.formValues.username}
            label={this.props.intl.formatMessage(messages['account.settings.field.username'])}
            helpText={this.props.intl.formatMessage(
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
              && this.props.formValues.pending_name_change
                ? this.props.formValues.pending_name_change
                : this.props.formValues.name
              }
            label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
            emptyLabel={
              this.isEditable('name')
                ? this.props.intl.formatMessage(messages['account.settings.field.full.name.empty'])
                : this.renderEmptyStaticFieldMessage()
            }
            helpText={
              verifiedName
                ? this.renderFullNameHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)
                : this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text'])
            }
            isEditable={
              verifiedName
                ? this.isEditable('verifiedName') && this.isEditable('name')
                : this.isEditable('name')
            }
            isGrayedOut={
              verifiedName && !this.isEditable('verifiedName')
            }
            onChange={this.handleEditableFieldChange}
            onSubmit={this.handleSubmitProfileName}
          />
          {verifiedName
            && (
            <EditableField
              name="verified_name"
              type="text"
              value={this.props.formValues.verified_name}
              label={
                (
                  <div className="d-flex">
                    {this.props.intl.formatMessage(messages['account.settings.field.name.verified'])}
                    {
                      this.renderVerifiedNameIcon(verifiedName.status)
                    }
                  </div>
                )
              }
              helpText={this.renderVerifiedNameHelpText(verifiedName.status, verifiedName.proctored_exam_attempt_id)}
              isEditable={this.isEditable('verifiedName')}
              isGrayedOut={!this.isEditable('verifiedName')}
              onChange={this.handleEditableFieldChange}
              onSubmit={this.handleSubmitVerifiedName}
            />
            )}

          <EmailField
            name="email"
            label={this.props.intl.formatMessage(messages['account.settings.field.email'])}
            emptyLabel={
              this.isEditable('email')
                ? this.props.intl.formatMessage(messages['account.settings.field.email.empty'])
                : this.renderEmptyStaticFieldMessage()
            }
            value={this.props.formValues.email}
            confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
            helpText={this.props.intl.formatMessage(
              messages['account.settings.field.email.help.text'],
              { siteName: getConfig().SITE_NAME },
            )}
            isEditable={this.isEditable('email')}
            {...editableFieldProps}
          />
          {this.renderSecondaryEmailField(editableFieldProps)}
          <ResetPassword email={this.props.formValues.email} />
          {(!getConfig().ENABLE_COPPA_COMPLIANCE)
            && (
            <EditableSelectField
              name="year_of_birth"
              type="select"
              label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.dob.empty'])}
              value={this.props.formValues.year_of_birth}
              options={yearOfBirthOptions}
              {...editableFieldProps}
            />
            )}
          <EditableSelectField
            name="country"
            type="select"
            value={this.props.formValues.country}
            options={countryOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.country'])}
            emptyLabel={
              this.isEditable('country')
                ? this.props.intl.formatMessage(messages['account.settings.field.country.empty'])
                : this.renderEmptyStaticFieldMessage()
            }
            isEditable={this.isEditable('country')}
            {...editableFieldProps}
          />
          {showState
            && (
            <EditableSelectField
              name="state"
              type="select"
              value={this.props.formValues.state}
              options={stateOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.state'])}
              emptyLabel={
                this.isEditable('state')
                  ? this.props.intl.formatMessage(messages['account.settings.field.state.empty'])
                  : this.renderEmptyStaticFieldMessage()
              }
              isEditable={this.isEditable('state')}
              {...editableFieldProps}
            />
            )}
        </div>

        <div className="account-section pt-3 mb-5" id="profile-information" ref={this.navLinkRefs['#profile-information']}>
          <h2 className="section-heading h4 mb-3">
            {this.props.intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableSelectField
            name="level_of_education"
            type="select"
            value={this.props.formValues.level_of_education}
            options={getConfig().ENABLE_COPPA_COMPLIANCE
              ? educationLevelOptions.filter(option => option.value !== 'el')
              : educationLevelOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.education'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.education.empty'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="gender"
            type="select"
            value={this.props.formValues.gender}
            options={genderOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.gender'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.gender.empty'])}
            {...editableFieldProps}
          />
          {hasWorkExperience
          && (
          <EditableSelectField
            name="work_experience"
            type="select"
            value={this.props.formValues?.extended_profile?.find(field => field.field_name === 'work_experience')?.field_value}
            options={workExperienceOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.work.experience'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.work.experience.empty'])}
            {...editableFieldProps}
          />
          )}
          <EditableSelectField
            name="language_proficiencies"
            type="select"
            value={this.props.formValues.language_proficiencies}
            options={languageProficiencyOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
            {...editableFieldProps}
          />
        </div>
        <div className="account-section pt-3 mb-5" id="social-media">
          <h2 className="section-heading h4 mb-3">
            {this.props.intl.formatMessage(messages['account.settings.section.social.media'])}
          </h2>
          <p>
            {this.props.intl.formatMessage(
              messages['account.settings.section.social.media.description'],
              { siteName: getConfig().SITE_NAME },
            )}
          </p>

          <EditableField
            name="social_link_linkedin"
            type="text"
            value={this.props.formValues.social_link_linkedin}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_facebook"
            type="text"
            value={this.props.formValues.social_link_facebook}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.facebook'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.facebook.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_twitter"
            type="text"
            value={this.props.formValues.social_link_twitter}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.twitter'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.twitter.empty'])}
            {...editableFieldProps}
          />
        </div>

        <div className="account-section pt-3 mb-5" id="site-preferences" ref={this.navLinkRefs['#site-preferences']}>
          <h2 className="section-heading h4 mb-3">
            {this.props.intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <BetaLanguageBanner />
          <EditableSelectField
            name="siteLanguage"
            type="select"
            options={this.props.siteLanguageOptions}
            value={this.props.siteLanguage.draft !== undefined ? this.props.siteLanguage.draft : this.context.locale}
            label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableSelectField
            name="time_zone"
            type="select"
            value={this.props.formValues.time_zone}
            options={timeZoneOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.time.zone'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.time.zone.empty'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.time.zone.description'])}
            {...editableFieldProps}
            onSubmit={(formId, value) => {
              // the endpoint will not accept an empty string. it must be null
              this.handleSubmit(formId, value || null);
            }}
          />
        </div>

        <div className="account-section pt-3 mb-5" id="linked-accounts" ref={this.navLinkRefs['#linked-accounts']}>
          <h2 className="section-heading h4 mb-3">{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>
            {this.props.intl.formatMessage(
              messages['account.settings.section.linked.accounts.description'],
              { siteName: getConfig().SITE_NAME },
            )}
          </p>
          <ThirdPartyAuth />
        </div>

        {getConfig().ENABLE_ACCOUNT_DELETION
          && (
          <div className="account-section pt-3 mb-5" id="delete-account" ref={this.navLinkRefs['#delete-account']}>
            <DeleteAccount
              isVerifiedAccount={this.props.isActive}
              hasLinkedTPA={hasLinkedTPA}
            />
          </div>
          )}

      </>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['account.settings.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['account.settings.loading.message'])} />
    );
  }

  render() {
    const {
      loading,
      loaded,
      loadingError,
    } = this.props;

    return (
      <div className="page__account-settings container-fluid py-5">
        {this.renderDuplicateTpaProviderMessage()}
        <h1 className="mb-4">
          {this.props.intl.formatMessage(messages['account.settings.page.heading'])}
        </h1>
        <div>
          <div className="row">
            <div className="col-md-2">
              <JumpNav />
            </div>
            <div className="col-md-10">
              {loading ? this.renderLoading() : null}
              {loaded ? this.renderContent() : null}
              {loadingError ? this.renderError() : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AccountSettingsPage.contextType = AppContext;

AccountSettingsPage.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,

  // Form data
  formValues: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    secondary_email: PropTypes.string,
    secondary_email_enabled: PropTypes.bool,
    year_of_birth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    country: PropTypes.string,
    level_of_education: PropTypes.string,
    gender: PropTypes.string,
    extended_profile: PropTypes.string,
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
  nameChangeModal: PropTypes.shape({
    formId: PropTypes.string,
  }),
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
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  committedValues: {
    useVerifiedNameForCerts: false,
    verified_name: null,
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
  nameChangeModal: {},
  verifiedName: null,
  mostRecentVerifiedName: {},
  verifiedNameHistory: [],
};

export default withLocation(withNavigate(connect(accountSettingsPageSelector, {
  fetchCourseList,
  fetchSettings,
  saveSettings,
  saveMultipleSettings,
  updateDraft,
  fetchSiteLanguages,
  beginNameChange,
})(injectIntl(AccountSettingsPage))));
