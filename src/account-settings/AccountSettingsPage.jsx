import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import findIndex from 'lodash.findindex';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from '@edx/frontend-i18n';
import { Hyperlink } from '@edx/paragon';

import messages from './AccountSettingsPage.messages';

import { fetchSettings, saveSettings, updateDraft } from './actions';
import { accountSettingsPageSelector } from './selectors';

import { PageLoading } from '../common';
import JumpNav from './components/JumpNav';
import Alert from './components/Alert';
import DeleteMyAccount from './components/DeleteMyAccount';
import EditableField from './components/EditableField';
import PasswordReset from './components/PasswordReset';
import ThirdPartyAuth from './components/ThirdPartyAuth';
import BetaLanguageBanner from './components/BetaLanguageBanner';
import EmailField from './components/EmailField';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
} from './constants/';
import { fetchSiteLanguages } from '../site-language';

class AccountSettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.educationLevels = EDUCATION_LEVELS.map(key => ({
      value: key,
      label: props.intl.formatMessage(messages[`account.settings.field.education.levels.${key || 'empty'}`]),
    }));
    this.genderOptions = GENDER_OPTIONS.map(key => ({
      value: key,
      label: props.intl.formatMessage(messages[`account.settings.field.gender.options.${key || 'empty'}`]),
    }));
    this.languageProficiencyOptions = [{
      value: '',
      label: props.intl.formatMessage(messages['account.settings.field.language_proficiencies.options.empty']),
    }].concat(props.languageProficiencyOptions);
    this.yearOfBirthOptions = [{
      value: '',
      label: props.intl.formatMessage(messages['account.settings.field.year_of_birth.options.empty']),
    }].concat(YEAR_OF_BIRTH_OPTIONS);
    this.countryOptions = [{
      value: '',
      label: props.intl.formatMessage(messages['account.settings.field.country.options.empty']),
    }].concat(props.countryOptions);
  }

  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchSiteLanguages();
  }

  getTimeZoneOptions = memoize((timeZoneOptions, countryTimeZoneOptions) => {
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

  isEditable(fieldName) {
    return !this.props.staticFields.includes(fieldName);
  }

  isManagedProfile() {
    // Enterprise customer profiles are managed by their organizations. We determine whether
    // a profile is managed or not by the presence of the profileDataManager prop.
    return Boolean(this.props.profileDataManager);
  }

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    this.props.saveSettings(formId, values);
  };

  renderDuplicateTpaProviderMessage() {
    if (!this.props.duplicateTpaProvider) {
      return null;
    }

    return (
      <div>
        <Alert className="alert alert-danger" role="alert">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another edX account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another edX account"
            values={{
              provider: <b>{this.props.duplicateTpaProvider}</b>,
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
                <Hyperlink destination={this.props.supportUrl} target="_blank">
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

  renderEmptyStaticFieldMessage() {
    if (this.isManagedProfile()) {
      return this.props.intl.formatMessage(messages['account.settings.static.field.empty'], {
        enterprise: this.props.profileDataManager,
      });
    }
    return this.props.intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);
  }

  renderSecondaryEmailField(editableFieldProps) {
    if (this.props.hiddenFields.includes('secondary_email')) {
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

    const timeZoneOptions = this.getTimeZoneOptions(
      this.props.timeZoneOptions,
      this.props.countryTimeZoneOptions,
    );

    const hasLinkedTPA = findIndex(this.props.tpaProviders, provider => provider.connected) >= 0;

    return (
      <React.Fragment>
        <div className="account-section" id="basic-information">
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
            helpText={this.props.intl.formatMessage(messages['account.settings.field.username.help.text'])}
            isEditable={false}
            {...editableFieldProps}
          />
          <EditableField
            name="name"
            type="text"
            value={this.props.formValues.name}
            label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
            emptyLabel={
              this.isEditable('name') ?
                this.props.intl.formatMessage(messages['account.settings.field.full.name.empty']) :
                this.renderEmptyStaticFieldMessage()
            }
            helpText={this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text'])}
            isEditable={this.isEditable('name')}
            {...editableFieldProps}
          />
          <EmailField
            name="email"
            label={this.props.intl.formatMessage(messages['account.settings.field.email'])}
            emptyLabel={
              this.isEditable('email') ?
                this.props.intl.formatMessage(messages['account.settings.field.email.empty']) :
                this.renderEmptyStaticFieldMessage()
            }
            value={this.props.formValues.email}
            confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.email.help.text'])}
            isEditable={this.isEditable('email')}
            {...editableFieldProps}
          />
          {this.renderSecondaryEmailField(editableFieldProps)}
          <PasswordReset />
          <EditableField
            name="year_of_birth"
            type="select"
            label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.dob.empty'])}
            value={this.props.formValues.year_of_birth}
            options={this.yearOfBirthOptions}
            {...editableFieldProps}
          />
          <EditableField
            name="country"
            type="select"
            value={this.props.formValues.country}
            options={this.countryOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.country'])}
            emptyLabel={
              this.isEditable('country') ?
                this.props.intl.formatMessage(messages['account.settings.field.country.empty']) :
                this.renderEmptyStaticFieldMessage()
            }
            isEditable={this.isEditable('country')}
            {...editableFieldProps}
          />
        </div>

        <div className="account-section" id="profile-information">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableField
            name="level_of_education"
            type="select"
            value={this.props.formValues.level_of_education}
            options={this.educationLevels}
            label={this.props.intl.formatMessage(messages['account.settings.field.education'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.education.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="gender"
            type="select"
            value={this.props.formValues.gender}
            options={this.genderOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.gender'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.gender.empty'])}
            {...editableFieldProps}
          />
          <EditableField
            name="language_proficiencies"
            type="select"
            value={this.props.formValues.language_proficiencies}
            options={this.languageProficiencyOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
            {...editableFieldProps}
          />
        </div>

        <div className="account-section" id="social-media">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.social.media'])}
          </h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.social.media.description'])}</p>

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

        <div className="account-section" id="site-preferences">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <BetaLanguageBanner />
          <EditableField
            name="siteLanguage"
            type="select"
            options={this.props.siteLanguageOptions}
            value={this.props.siteLanguage.draftOrSavedValue}
            label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableField
            name="time_zone"
            type="select"
            value={this.props.formValues.time_zone || ''}
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

        <div className="account-section" id="linked-accounts">
          <h2 className="section-heading">{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts.description'])}</p>
          <ThirdPartyAuth />
        </div>

        <div className="account-section" id="delete-account">
          <DeleteMyAccount
            isVerifiedAccount={this.props.isActive}
            hasLinkedTPA={hasLinkedTPA}
            logoutUrl={this.props.logoutUrl}
          />
        </div>

      </React.Fragment>
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
              <JumpNav />
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
    year_of_birth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    country: PropTypes.string,
    level_of_education: PropTypes.string,
    gender: PropTypes.string,
    language_proficiencies: PropTypes.string,
    social_link_linkedin: PropTypes.string,
    social_link_facebook: PropTypes.string,
    social_link_twitter: PropTypes.string,
    time_zone: PropTypes.string,
  }).isRequired,
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draftOrSavedValue: PropTypes.string,
    savedValue: PropTypes.string,
  }),
  siteLanguageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  countryOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  languageProficiencyOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  profileDataManager: PropTypes.string,
  staticFields: PropTypes.arrayOf(PropTypes.string),
  hiddenFields: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,

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
  duplicateTpaProvider: PropTypes.string,
  tpaProviders: PropTypes.arrayOf(PropTypes.object),
  supportUrl: PropTypes.string.isRequired,
  logoutUrl: PropTypes.string.isRequired,
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguage: null,
  siteLanguageOptions: [],
  countryOptions: [],
  timeZoneOptions: [],
  countryTimeZoneOptions: [],
  languageProficiencyOptions: [],
  profileDataManager: null,
  staticFields: [],
  hiddenFields: ['secondary_email'],
  duplicateTpaProvider: null,
  tpaProviders: [],
  isActive: true,
};


export default connect(accountSettingsPageSelector, {
  fetchSettings,
  saveSettings,
  updateDraft,
  fetchSiteLanguages,
})(injectIntl(AccountSettingsPage));
