import { AppContext } from '@edx/frontend-platform/react';
import { getConfig, history, getQueryParameters } from '@edx/frontend-platform';
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
import { Hyperlink, Icon } from '@edx/paragon';
import { CheckCircle } from '@edx/paragon/icons';

import messages from './AccountSettingsPage.messages';
import { fetchSettings, saveSettings, updateDraft } from './data/actions';
import { accountSettingsPageSelector } from './data/selectors';
import PageLoading from './PageLoading';
import Alert from './Alert';
import JumpNav from './JumpNav';
import DeleteAccount from './delete-account';
import EditableField from './EditableField';
import ResetPassword from './reset-password';
import ThirdPartyAuth from './third-party-auth';
import BetaLanguageBanner from './BetaLanguageBanner';
import EmailField from './EmailField';
import OneTimeDismissibleAlert from './OneTimeDismissibleAlert';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
  COUNTRY_WITH_STATES,
  getStatesList,
} from './data/constants';
import { fetchSiteLanguages } from './site-language';
import CoachingToggle from './coaching/CoachingToggle';
import DemographicsSection from './demographics/DemographicsSection';

class AccountSettingsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // If there is a "duplicate_provider" query parameter, that's the backend's
    // way of telling us that the provider account the user tried to link is already linked
    // to another user account on the platform. We use this to display a message to that effect,
    // and remove the parameter from the URL.
    const duplicateTpaProvider = getQueryParameters().duplicate_provider;
    if (duplicateTpaProvider !== undefined) {
      history.replace(history.location.pathname);
    }
    this.state = {
      duplicateTpaProvider,
    };

    this.navLinkRefs = {
      '#basic-information': React.createRef(),
      '#profile-information': React.createRef(),
      '#demographics-information': React.createRef(),
      '#social-media': React.createRef(),
      '#site-preferences': React.createRef(),
      '#linked-accounts': React.createRef(),
      '#delete-account': React.createRef(),
    };
  }

  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchSiteLanguages();
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
  }));

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    this.props.saveSettings(formId, values);
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

    return (
      <div>
        <Alert className="alert alert-danger" role="alert">
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
        <Alert className="alert alert-primary" role="alert">
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

  renderVerifiedNameSuccessMessage() {
    if (this.props.formValues.verified_name_enabled && this.props.formValues.is_verified) {
      return (
        <OneTimeDismissibleAlert
          id="dismissedVerifiedNameSuccessMessage"
          variant="success"
          icon={CheckCircle}
          header={this.props.intl.formatMessage(messages['account.settings.field.name.verified.sucess.message.header'])}
          body={this.props.intl.formatMessage(messages['account.settings.field.name.verified.sucess.message'])}
        />
      );
    }

    return null;
  }

  renderEmptyStaticFieldMessage() {
    if (this.isManagedProfile()) {
      return this.props.intl.formatMessage(messages['account.settings.static.field.empty'], {
        enterprise: this.props.profileDataManager,
      });
    }
    return this.props.intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);
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

  renderDemographicsSection() {
    // check the result of an LMS API call to determine if we should render the DemographicsSection component
    if (this.props.formValues.shouldDisplayDemographicsSection) {
      return (
        <DemographicsSection forwardRef={this.navLinkRefs['#demographics-information']} />
      );
    }
    return null;
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
    } = this.getLocalizedOptions(this.context.locale, this.props.formValues.country);

    // Show State field only if the country is US (could include Canada later)
    const showState = this.props.formValues.country === COUNTRY_WITH_STATES;

    const showVerifiedName = this.props.formValues.verified_name_enabled && this.props.formValues.verified_name;

    const timeZoneOptions = this.getLocalizedTimeZoneOptions(
      this.props.timeZoneOptions,
      this.props.countryTimeZoneOptions,
      this.context.locale,
    );

    const hasLinkedTPA = findIndex(this.props.tpaProviders, provider => provider.connected) >= 0;

    return (
      <>
        <div className="account-section" id="basic-information" ref={this.navLinkRefs['#basic-information']}>
          {this.renderVerifiedNameSuccessMessage()}

          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.account.information'])}
          </h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          {this.renderManagedProfileMessage()}

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
            value={this.props.formValues.name}
            label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
            emptyLabel={
              this.isEditable('name')
                ? this.props.intl.formatMessage(messages['account.settings.field.full.name.empty'])
                : this.renderEmptyStaticFieldMessage()
            }
            helpText={this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text'])}
            isEditable={this.isEditable('name')}
            {...editableFieldProps}
          />
          {showVerifiedName
            && (
            <EditableField
              name="verifiedName"
              type="text"
              value={this.props.formValues.verified_name}
              label={
                (
                  <div className="d-flex">
                    {this.props.intl.formatMessage(messages['account.settings.field.name.verified'])}
                    {this.props.formValues.is_verified && <Icon src={CheckCircle} className="ml-1" style={{ height: '18px', width: '18px', color: 'green' }} />}
                  </div>
                )
              }
              helpText={
                this.props.formValues.is_verified
                  ? this.props.intl.formatMessage(messages['account.settings.field.name.verified.help.text.verified'])
                  : this.props.intl.formatMessage(messages['account.settings.field.name.verified.help.text.pending'])
              }
              isEditable={this.isEditable('verified_name')}
              {...editableFieldProps}
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
          <EditableField
            name="year_of_birth"
            type="select"
            label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.dob.empty'])}
            value={this.props.formValues.year_of_birth}
            options={yearOfBirthOptions}
            {...editableFieldProps}
          />
          <EditableField
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
            <EditableField
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

        <div className="account-section" id="profile-information" ref={this.navLinkRefs['#profile-information']}>
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableField
            name="level_of_education"
            type="select"
            value={this.props.formValues.level_of_education}
            options={educationLevelOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.education'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.education.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="gender"
            type="select"
            value={this.props.formValues.gender}
            options={genderOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.gender'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.gender.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="language_proficiencies"
            type="select"
            value={this.props.formValues.language_proficiencies}
            options={languageProficiencyOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
            {...editableFieldProps}
          />
          {getConfig().COACHING_ENABLED
            && this.props.formValues.coaching.eligible_for_coaching
            && (
            <CoachingToggle
              name="coaching"
              phone_number={this.props.formValues.phone_number}
              coaching={this.props.formValues.coaching}
            />
            )}
        </div>
        {getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && this.renderDemographicsSection()}
        <div className="account-section" id="social-media">
          <h2 className="section-heading">
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

        <div className="account-section" id="site-preferences" ref={this.navLinkRefs['#site-preferences']}>
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <BetaLanguageBanner />
          <EditableField
            name="siteLanguage"
            type="select"
            options={this.props.siteLanguageOptions}
            value={this.props.siteLanguage.draft !== undefined ? this.props.siteLanguage.draft : this.context.locale}
            label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableField
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

        <div className="account-section" id="linked-accounts" ref={this.navLinkRefs['#linked-accounts']}>
          <h2 className="section-heading">{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>
            {this.props.intl.formatMessage(
              messages['account.settings.section.linked.accounts.description'],
              { siteName: getConfig().SITE_NAME },
            )}
          </p>
          <ThirdPartyAuth />
        </div>

        <div className="account-section" id="delete-account" ref={this.navLinkRefs['#delete-account']}>
          <DeleteAccount
            isVerifiedAccount={this.props.isActive}
            hasLinkedTPA={hasLinkedTPA}
          />
        </div>

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
            <div className="col-md-3">
              <JumpNav
                displayDemographicsLink={this.props.formValues.shouldDisplayDemographicsSection}
              />
            </div>
            <div className="col-md-9">
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
    language_proficiencies: PropTypes.string,
    phone_number: PropTypes.string,
    social_link_linkedin: PropTypes.string,
    social_link_facebook: PropTypes.string,
    social_link_twitter: PropTypes.string,
    time_zone: PropTypes.string,
    coaching: PropTypes.shape({
      coaching_consent: PropTypes.bool.isRequired,
      user: PropTypes.number.isRequired,
      eligible_for_coaching: PropTypes.bool.isRequired,
    }),
    state: PropTypes.string,
    shouldDisplayDemographicsSection: PropTypes.bool,
    verified_name: PropTypes.string,
    is_verified: PropTypes.bool,
    verified_name_enabled: PropTypes.bool,
  }).isRequired,
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
  saveSettings: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  tpaProviders: PropTypes.arrayOf(PropTypes.object),
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguage: null,
  siteLanguageOptions: [],
  timeZoneOptions: [],
  countryTimeZoneOptions: [],
  profileDataManager: null,
  staticFields: [],
  tpaProviders: [],
  isActive: true,
  secondary_email_enabled: false,
};

export default connect(accountSettingsPageSelector, {
  fetchSettings,
  saveSettings,
  updateDraft,
  fetchSiteLanguages,
})(injectIntl(AccountSettingsPage));
